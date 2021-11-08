const Sauce = require('../models/Sauce');
const User = require('../models/User');
const Like = require('../models/Like');
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
					console.log(sauce)
					let storedUrl = sauce.imageUrl.split('/images/')[1]
					fs.unlink(`images/${storedUrl}`, (err) =>{
						if(err) throw err
						console.log(`images/${storedUrl} has been deleted`);
					})
					res.status(201).json({ message: "c'est modif !" })
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
			.then(() => res.status(201).json({ message: "Objet modifié" }))
			.catch((err) => res.status(400).json({ err }));
	}
}


exports.voteOneSauce = (req, res, next) =>{
	let allUsers = [];
	let voteValue = req.body.like
	let userId = req.body.userId

	User.find()
		.then(users => {
			users.forEach(elem => allUsers.push(elem._id.toString()))
		})
		.catch(error => res.status(500).json({ error }))

	Sauce.findById(req.params.id)
	
		.then(sauce =>  {

			let likesNb = sauce.likes
			let dislikesNb = sauce.dislikes
			let likeArr = [...sauce.usersLiked]
			let dislikeArr = [...sauce.usersDisliked]

			let checkVote = (arr, vote) => {
				let arrCheck = arr.some(e => e === userId)
				arrUpdate = arr.filter(e => e !== userId)
				return arrCheck ? [arrUpdate, vote -= 1] : [arr, vote]
			}

			let addVote = (arr, vote) => {
				arr.push(userId)
				return vote += 1
			}

			let checkAlreadyVoted = (arr) => {
				let isThere = arr.some(e => e === userId)
				if(isThere) throw ("You cannot do the same vote twice !")
			}

			let checkRegistered = (userArr, id) =>{
				let userCheck = userArr.some(user => user === id)
				if(!userCheck){
					throw ("This user does not exist on database")
				}
			}

			checkRegistered(allUsers, userId)

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
				.then(() => res.status(201).json({ message: "Vote registered !" }))
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

  sauce.save()
		.then(() => res.status(201).json({ Message: "Sauce Créé" }))
		.catch(err => res.status(400).json({ err }))

}