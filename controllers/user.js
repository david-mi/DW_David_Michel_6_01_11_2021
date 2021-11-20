const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config()


exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      password: hash,
      email: req.body.email
      })
      user.save()
        .then(() => res.status(201).json({Message : 'Utilisateur Créé !'}))
        .catch(err => res.status(500).json( err));
    })
  .catch(err => res.status(500).json({ err }))
};

exports.login = ((req, res) => {
  User.findOne({ email: req.body.email })
		.then(user =>{
			if(!user){
				return res.status(401).json({ erreur: 'Utilisateur non trouvé'});
			}
			bcrypt.compare(req.body.password, user.password)
				.then(valid => {
					if(!valid){
						return res.status(401).json({ erreur: 'Mot de passe incorrect'});
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign(
							{ userId: user._id },
							process.env.TOKEN_KEY,
							{ expiresIn: '24h'}
						)
					})
				})
				.catch(err => res.status(500).json({ err }));
		})
		.catch(err => res.status(500).json({ err }))
});