const express = require('express');
const router = express.Router();
const connection = require("../config");

// get all food
router.get('/', (req,res) => {
    connection.query('SELECT * FROM food', (err, results) => {
        if(err) {
            res.status(500).send('Erreur lors de la récupération de tous les plats');
        };
        res.json(results);
    });
});

// get one food
router.get('/:id', (req, res) => {
    const idFood = req.params.id
    connection.query("SELECT * FROM food WHERE id = ?", [idFood], (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send("Erreur lors de l'affichage du plat");
      } else {
        res.status(200).json(results);
      }
    })
});


// create join food with user
router.post('/:idFood/:idUser', (req, res) => {
    const { idFood, idUser } = req.params;
    connection.query('INSERT INTO `match` (id_user, id_food) VALUES(?, ?)', [idUser, idFood], (err, results) => {
        if (err) {
            res.status(500).json("Erreur lors de la création de jointure d'un plat avec un utilisateur");
          } else {
            res.sendStatus(201);
          };
    });
});

// get all users who loves same plate
router.get('/:id/users', (req, res) => {
    const {id} = req.params;
    connection.query('SELECT u.* FROM user AS u JOIN `match` AS m ON m.id_user = u.id JOIN food AS f ON f.id = m.id_food WHERE f.id = ?',  [id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(404).send("Erreur lors de l'affichage des utilisateurs qui aiment le même plat");
          } else {
            res.status(200).json(results);
          };
    });
});

module.exports = router;