const express = require("express");

const { getAllUsers, signupUser, logInUser } = require('../controllers/user-controller');

const router = express.Router();

router.get('/', getAllUsers);

router.post('/signup', signupUser);

router.post('/login', logInUser);

module.exports = router;