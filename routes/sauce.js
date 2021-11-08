const express = require('express');
const router = express.Router();
// on importe les controllers user
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const idCompare = require('../middleware/idCompare');

router.post('/', multer, auth, sauceCtrl.addSauce)
router.post('/:id/like', auth, sauceCtrl.voteOneSauce)
router.get('/', sauceCtrl.getAllSauces)
router.get('/:id', sauceCtrl.getOneSauce)
router.delete('/:id', auth, idCompare, sauceCtrl.deleteOneSauce)
router.put('/:id', multer, auth, idCompare, sauceCtrl.updateOneSauce)

module.exports = router;