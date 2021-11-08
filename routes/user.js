const express = require('express');
const router = express.Router();
// on importe les controllers user
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const pw = require('../middleware/password');

router.post('/signup', pw, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;