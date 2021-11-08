module.exports = ((req, res, next) =>{
  let pw = req.body.password;
  const testUpperCase = /[A-Z]/.test(pw)
  const testLowerCase = /[a-z]/.test(pw)
  const testNumber = /[0-9]/.test(pw)
  
  if(pw.length < 6){
    res.status(400).json({erreur: 'Votre mot de passe doit comporter 8 caractères ou plus'})
  }else if(!testUpperCase){
    throw('Il manque une majuscule !')
  }else if(!testLowerCase){
    throw('il manque une minuscule !')
  }else if(!testNumber){
    throw('il manque un chiffre')
    }else{
      next()
    }
    
})