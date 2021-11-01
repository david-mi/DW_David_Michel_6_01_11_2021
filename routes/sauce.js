const express = require('express');
const router = express.Router();
// on importe les controllers user
const sauceCtrl = require('../controllers/sauce');

const multer = require('../middleware/multer-config');

router.post('/', multer, sauceCtrl.addSauce)
router.get('/', sauceCtrl.getAllSauces)
router.get('/:id', sauceCtrl.getOneSauce)

module.exports = router;