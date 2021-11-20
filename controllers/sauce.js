const Sauce = require('../models/Sauce');
const User = require('../models/User');
const fs = require('fs');

// fonction pour parser une cible définie
const parseSauce = target => JSON.parse(target);

exports.getAllSauces = (req, res) =>{
  Sauce.find()
		.then(sauces => res.status(200).json( sauces ))
		.catch(err => res.status(404).json({ err }))	
}

exports.getOneSauce = (req, res) =>{
	Sauce.findById(req.params.id)
		.then(sauce => res.status(200).json(sauce))
		.catch(err => res.status(404).json({ err }));
}

exports.deleteOneSauce = (req, res) =>{
	Sauce.findByIdAndRemove(req.params.id)
		.then(deleted => {
			const filename = deleted.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => res.status(201).json({ message: "Eléments supprimés !" }))
		})
		.catch(err => res.status(400).json({ err }));		
}	

// mettre à jour une sauce avec son image

exports.updateOneSauce = (req, res, next) =>{

	/// on regarde si l'objet sauce existe dans la requête
	/// si oui ça veut dire qu'on souhaite changer l'image
	if (req.body.sauce){
		let parsedSauce = parseSauce(req.body.sauce)
		const updatedSauce = new Sauce({
			_id: req.params.id,
			name: parsedSauce.name,
			manufacturer: parsedSauce.manufacturer,
			description: parsedSauce.description,
			mainPepper: parsedSauce.mainPepper,
			heat: parsedSauce.heat,
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
					},{ runValidators: true })
			Sauce.findByIdAndUpdate(req.params.id, updatedSauce, { runValidators: true })
				.then(sauce => {
					let storedUrl = sauce.imageUrl.split('/images/')[1]
					fs.unlink(`images/${storedUrl}`, (err) =>{
						if(err) throw err
						console.log(`images/${storedUrl} a été supprimée`);
					})
					res.status(201).json({ message: "Sauce modifiée" })
				})
				.catch(err => {
					fs.unlink(`images/${req.file.filename}`, (err) =>{
						if(err) throw err
						console.log('Nouvelle image supprimée')
					})
					res.status(400).json(err)	
				})
		
	/// si l'objet sauce n'est pas trouvé dans la requête
	// ça veut dire que les informations se trouve directement dans
	// le body et qu'on ne souhaite pas changer l'image	
	}else{
		Sauce.updateOne({_id: req.params.id}, {
			_id: req.params.id,
			name: req.body.name,
			manufacturer: req.body.manufacturer,
			description: req.body.description,
			mainPepper: req.body.mainPepper,
			heat: req.body.heat
				},{ runValidators: true })
			.then(() => res.status(201).json({ message: "Sauce modifiée" }))
			.catch((err) => res.status(400).json(err));
	}
}


exports.voteOneSauce = (req, res, next) =>{
	let voteValue = req.body.like
	let userId = req.token.userId

	Sauce.findById(req.params.id)
	
		.then(sauce =>  {

			let likesNb = sauce.likes
			let dislikesNb = sauce.dislikes
			let likeArr = [...sauce.usersLiked]
			let dislikeArr = [...sauce.usersDisliked]

			// va regarder si l'user à déjà fait le vote inverse
			// si oui on décrémente le nombre de vote total
			// et on le retire du tableau
			let checkVote = (arr, vote) => {
				let arrCheck = arr.some(e => e === userId)
				arrUpdate = arr.filter(e => e !== userId)
				return arrCheck ? [arrUpdate, vote -= 1] : [arr, vote]
			}

			// va ajouter l'utilisateur dans le tableau approprié a son vote
			// va aussi incrémenter la valeur de vote totale
			let addVote = (arr, vote) => {
				arr.push(userId)
				return vote += 1
			}

			// va regarder si l'utilisateur à déjà fait le même vote précédemment
			// Si oui on renvoie un message d'erreur
			let checkAlreadyVoted = (arr) => {
				let isThere = arr.some(e => e === userId)
				if(isThere) throw ("Vous ne pouvez pas faire le même vote deux fois")
			}


			if(voteValue === -1){
				checkAlreadyVoted(dislikeArr);
				[likeArr, likesNb] = checkVote(likeArr, likesNb)
				dislikesNb = addVote(dislikeArr, dislikesNb)
			}else if(voteValue === 1){
				checkAlreadyVoted (likeArr);
				[dislikeArr, dislikesNb] = checkVote(dislikeArr, dislikesNb)
				likesNb = addVote(likeArr, likesNb)
			}else if(voteValue === 0){
				[likeArr, likesNb] = checkVote(likeArr, likesNb);
				[dislikeArr, dislikesNb] = checkVote(dislikeArr, dislikesNb);
			}else{
				throw ("Valeur de vote incorrecte")
			}
		
			console.log(`Likes: ${likesNb}`)
			console.log(`Dislikes: ${dislikesNb}`)
			console.log(`likeArr : ${likeArr}`)
			console.log(`dislikeArr : ${dislikeArr}`)

			Sauce.updateOne({_id: req.params.id},{
				
				likes: likesNb,
				dislikes: dislikesNb,
				usersLiked: likeArr,
				usersDisliked: dislikeArr
		
			})
				.then(() => res.status(201).json({ message: "Vote enregistré !" }))
				.catch(err => res.status(400).json({ err }))
		})
		.catch( err => res.status(404).json({ err }))
}

exports.addSauce = (req, res, next) => {
		let parsedSauce = parseSauce(req.body.sauce);
  	const sauce = new Sauce({
		userId: req.token.userId,
		name: parsedSauce.name,
		manufacturer: parsedSauce.manufacturer,
		description: parsedSauce.description,
		mainPepper: parsedSauce.mainPepper,
		heat: parsedSauce.heat,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  })
	let storedUrl = sauce.imageUrl.split('/images/')[1]
  sauce.save()
		.then(() => res.status(201).json({ Message: "Sauce Créé" }))
		.catch(err => {
			fs.unlink(`images/${storedUrl}`, (err) =>{
				if(err) throw err
				console.log(`images/${storedUrl} a été supprimée`);
			})
			res.status(400).json({ err })
		})

}