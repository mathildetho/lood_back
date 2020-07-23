const express = require('express');
const router = express.Router();
const connection = require("../config");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// get one user
router.get('/:id', (req, res) => {
    const {id} = req.params;
    connection.query("SELECT * FROM user WHERE id = ?", id, (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send("Erreur lors de l'affichage de l'user");
      } else {
        res.status(200).json(results);
      }
    })
});

// create profile
router.post('/', (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const formBody = {
        pseudo: req.body.pseudo,
        description: req.body.description,
        image: req.body.image,
        sexe: req.body.sexe,
        password: hash,
    };
    connection.query('INSERT INTO user SET ?', [formBody], (err, results) => {
        if(err) {
            res.status(500).send('Erreur lors de la création de l\'utilisateur');
        };
        res.sendStatus(201);
    });
});

// login and create token user
router.post('/login', (req, res) => {
    const formData = {
        pseudo: req.body.pseudo,
        password: req.body.password,
    };
    connection.query('SELECT * FROM user WHERE pseudo = ?', [formData.pseudo], (err, result) => {
        if(err) {
            res.status(500).send(err);
        } else {
            const samePwd = bcrypt.compareSync(formData.password, result[0].password);
            if(!samePwd){
                res.status(500).send('Wrong password');
            } else {
                jwt.sign({result}, process.env.SECRET_KEY, (err, token) => {
                    res.json({token});
                });
            };
        };
    });
});

// profile of one user
router.post('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authdata) => {
        if (err) {
            res.status(403).send(err);
        } else {
            res.json({
                message: 'Access ok',
                authdata
            });
        };
    });
});

// verify the token to go to profile
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(500);
    };
};

// put one user
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const hash = bcrypt.hashSync(req.body.password, 10);
    const formBody = {
        pseudo: req.body.pseudo,
        description: req.body.description,
        image: req.body.image,
        sexe: req.body.sexe,
        password: hash,
    };
    connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [formBody, id],
        (err) => {
            if (err) {
                res.status(500).send(
                    `Erreur lors de la modification d'un user`
                );
            } else {
                res.sendStatus(200);
            }
        }
    );
});

// get all favorite food of one user
router.get('/:id/foods', (req, res) => {
    const {id} = req.params;
    connection.query('SELECT f.*, u.id AS iduser FROM user AS u JOIN `match` AS m ON u.id = m.id_user JOIN food AS f ON m.id_food = f.id WHERE u.id = ?', [id], (err, results) => {
        if (err) {
            res.status(404).send("Erreur lors de l'affichage des plats favoris");
          } else {
            res.status(200).json(results);
          }
    })
})

// get all no favorite food of one user
router.get('/:id/foods/no', (req, res) => {
    const {id} = req.params;
    connection.query('SELECT f.*, u.id AS iduser FROM user AS u JOIN nomatch AS m ON u.id = m.id_user JOIN food AS f ON m.id_food = f.id WHERE u.id = ?', [id], (err, results) => {
        if (err) {
            res.status(404).send("Erreur lors de l'affichage des plats non favoris");
          } else {
            res.status(200).json(results);
          }
    })
})

module.exports = router;