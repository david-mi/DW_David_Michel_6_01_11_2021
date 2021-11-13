const express = require('express');
const router = express.Router();
// on importe les controllers user
const userCtrl = require('../controllers/user');
const rateLimit = require('../middleware/rateLimit');
const userValidator = require('../middleware/userValidator')


router.post('/signup', userValidator, userCtrl.signup);
router.post('/login', userValidator, rateLimit, userCtrl.login);

module.exports = router;