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
            res.status(500).json("Erreur lors de la création de jointure d'un plat favori avec un utilisateur");
          } else {
            res.sendStatus(201);
          };
    });
});

// delete join food with user
router.delete("/:idFood/:idUser", (req, res) => {
  const { idFood, idUser } = req.params;
  connection.query(
    "DELETE FROM `match` WHERE id_food = ? AND id_user = ?",
    [idFood, idUser],
    (err, result) => {
      if (err) {
        res.status(500).json("Erreur lors de la suppresion de la jointure food-user");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// create join no food with user
router.post('/:idFood/:idUser/no', (req, res) => {
  const { idFood, idUser } = req.params;
  connection.query('INSERT INTO nomatch (id_user, id_food) VALUES(?, ?)', [idUser, idFood], (err, results) => {
      if (err) {
          res.status(500).json("Erreur lors de la création de jointure d'un plat non favori avec un utilisateur");
        } else {
          res.sendStatus(201);
        };
  });
});

// delete join no food with user
router.delete("/:idFood/:idUser/no", (req, res) => {
const { idFood, idUser } = req.params;
connection.query(
  "DELETE FROM nomatch WHERE id_food = ? AND id_user = ?",
  [idFood, idUser],
  (err, result) => {
    if (err) {
      res.status(500).json("Erreur lors de la suppresion de la jointure non favori food-user");
    } else {
      res.sendStatus(200);
    }
  }
);
});

// get all users who loves same plate
router.get('/:id/users', (req, res) => {
    const {id} = req.params;
    connection.query('SELECT u.*, f.id as idfood FROM user AS u JOIN `match` AS m ON m.id_user = u.id JOIN food AS f ON f.id = m.id_food WHERE f.id = ?',  [id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(404).send("Erreur lors de l'affichage des utilisateurs qui aiment le même plat");
          } else {
            res.status(200).json(results);
          };
    });
});

module.exports = router;