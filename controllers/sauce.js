const Sauce = require('../models/Sauce');

exports.getAllSauces = (req, res, next) =>{
  Sauce.find()
		.then(sauces => res.status(200).json( sauces ))
		.catch(err => res.status(404).json({ err }))
	
}

exports.getOneSauce = (req, res, next) =>{
	Sauce.findOne({
		_id: req.params.id
	})
		.then(sauce => res.status(200).json(sauce))
		.catch(err => res.status(404).json({ err }));
}

exports.addSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
  	const sauce = new Sauce({
    ...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes: 0,        
    dislikes: 0,        
    usersLiked: [],        
    usersDisliked: [],  

  })

  sauce.save()
		.then(() => res.status(201).json({ Message: "Sauce Créé" }))
		.catch(err => res.status(400).json({ err }))

}