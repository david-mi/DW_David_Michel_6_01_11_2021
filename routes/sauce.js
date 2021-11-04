const express = require('express');
const router = express.Router();
// on importe les controllers user
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', multer, auth, sauceCtrl.addSauce)
router.post('/:id/like', auth, sauceCtrl.voteOneSauce)
router.get('/', sauceCtrl.getAllSauces)
router.get('/:id', sauceCtrl.getOneSauce)
router.delete('/:id', auth, sauceCtrl.deleteOneSauce)
router.put('/:id', multer, auth, sauceCtrl.updateOneSauce)

module.exports = router;