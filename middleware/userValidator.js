const { body, validationResult } = require('express-validator');

module.exports = [ 
  body('email').isEmail().withMessage('email invalide !'),
  body('password')
    .trim()
    .escape()
    .isLength({ min: 6}).withMessage('le mot de passe doit avoir au minimum 6 caractères !')
    .matches(/[a-z]/).withMessage('le mot de passe doit comporter au minimum une minuscule !')
    .matches(/[A-Z]/).withMessage('le mot de passe doit comporter au minimum une majuscule !')
    .matches(/[0-9]/).withMessage('le mot de passe doit comporter au minimum 1 chiffre !')

  ,(req, res, next) =>{
  
    const errors = validationResult(req)
    errors.isEmpty() ? next() : res.status(400).json( errors.mapped() )
  }
]
    