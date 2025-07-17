const { signup, login, reCreateAccessToken, logout } = require('../controllers/auth_Controller.js');

const express = require('express');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', reCreateAccessToken);
router.post('/logout', logout);


module.exports = router;

