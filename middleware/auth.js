const jwt = require('jsonwebtoken');
require('dotenv').config()


module.exports = ((req,res, next) =>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    req.token = jwt.verify(token, process.env.TOKEN_KEY);
    
    if(req.body.userId && req.body.userId !== req.token.userId){
      throw ('User Id non valable !')
    }else{
      next();
    }
  }catch(error){
    res.status(401).json({erreur: 'Requête non authentifiée'});
  }
});