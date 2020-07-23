const express = require('express');
const router = express.Router();
const users = require('./users');
const foods = require('./foods');

router.use('/users', users);
router.use('/foods', foods);

module.exports = router;