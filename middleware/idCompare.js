const Sauce = require('../models/Sauce');

module.exports = ((req, res, next) =>{
  Sauce.findById(req.params.id)
		.then(sauce => {
			if(sauce.userId !== req.token.userId){
				res.status(401).json({ message: "Vous n'êtes pas le propriétaire de cette sauce" })
      }else{
        next()
      }
    }).catch(err => res.status(404).json({ err }))
})