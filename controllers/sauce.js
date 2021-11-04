const Sauce = require('../models/Sauce');
const User = require('../models/User');
const Like = require('../models/Like');
const fs = require('fs');

// fonction pour parser une cible définie
const parseSauce = target => JSON.parse(target);

exports.getAllSauces = (req, res, next) =>{
  Sauce.find()
		.then(sauces => res.status(200).json( sauces ))
		.catch(err => res.status(404).json({ err }))	
}

exports.getOneSauce = (req, res, next) =>{
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
		let storedUrl = ''
		// on cherche d'abord l'image contenue dans 
		// la sauce qu'on veut modifier
		Sauce.findOne({ _id: req.params.id})
			.then(sauce => {
				// on garde son chemin
				storedUrl = sauce.imageUrl.split('/images/')[1]
				console.log(`Voici le storedUrl : ${storedUrl} \n /////////`)
			})
			.catch(err => res.status(404).json( { err } ))

			const updatedSauce = new Sauce({
				...parseSauce(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
				_id: req.params.id
			})
			Sauce.updateOne({_id: req.params.id},updatedSauce)
			.then(() => {
				fs.unlink(`images/${storedUrl}`, (err) =>{
					if(err){
						throw err
					}
					console.log(`images/${storedUrl} has been deleted`);
				})
			res.status(201).json( {message: "Objet modifié"})
		})
		.catch((err) => res.status(400).json({ err }));

	/// si l'objet sauce n'est pas trouvé dans la requête
	// ça veut dire que les informations se trouve directement dans
	// le body et qu'on ne souhaite pas changer l'image	
	}else{
		console.log(req.body)
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
	let allUsers = []
	let voteValue = req.body.like
	let userId = req.body.userId
	// console.log(voteValue)
	// console.log(userId)
	
	User.find()
		.then(users => {
			users.forEach(elem => allUsers.push(elem._id.toString()))
		})
		.catch(error => res.status(500).json({ error }))
		

	Sauce.findOne({_id: req.params.id})
	
		.then(sauce =>  {
			console.log('/////')
			// console.log(sauce)
			// console.log(allUsers)
			let likesNb = sauce.likes
			let dislikesNb = sauce.dislikes
			let likedTab = [...sauce.usersLiked]
			let dislikedTab = [...sauce.usersDisliked]

			let checkLike = (arr, id) => {
				let isThere = arr.some(e => e === id)
			
				if(isThere){ 
					likesNb -= 1
					return arr.filter(e => e !== id)
				}
				return arr
			}
			
			let checkDislike = (arr, id) => {
				let isThere = arr.some(e => e === id)
				
				if(isThere){
					dislikesNb -= 1
					return arr.filter(e => e !== id)
				}
				return arr
			}

			checkAlreadyVoted = (arr, id) =>{
				let isThere = arr.some(e => e === id)
				if(isThere){
					throw ("You cannot do the same vote twice !")
				}
			}

			let checkRegistered = (userArr, id) =>{
				let userCheck = userArr.some(user => user === id)
				if(!userCheck){
					throw ("This user does not exist on database")
				}
			}

			checkRegistered(allUsers, userId)

			if(voteValue === -1){
				checkAlreadyVoted (dislikedTab, userId)
				likedTab = checkLike(likedTab, userId)
				dislikesNb += 1
				dislikedTab.push(userId)
			}else if(voteValue === 1){
				checkAlreadyVoted (likedTab, userId)
				dislikedTab = checkDislike(dislikedTab, userId)
				likesNb += 1
				likedTab.push(userId)
			}else if(voteValue === 0){
				likedTab = checkLike(likedTab, userId)
				dislikedTab = checkDislike(dislikedTab, userId)
			}else{
				throw ("Invalid data !")
			}
		
			console.log(`Likes: ${likesNb}`)
			console.log(`Dislikes: ${dislikesNb}`)
			console.log(`likedTab : ${likedTab}`)
			console.log(`dislikedTab : ${dislikedTab}`)

			Sauce.updateOne({_id: req.params.id},{
				
				likes: likesNb,
				dislikes: dislikesNb,
				usersLiked: likedTab,
				usersDisliked: dislikedTab
		
			})
				.then(() => res.status(201).json({ message: "Vote registered !" }))
				.catch(err => res.status(400).json({ err }))
		})
		.catch( err => res.status(404).json({ err }))
	

}

exports.addSauce = (req, res, next) => {
		let parsedSauce = parseSauce(req.body.sauce);
  	const sauce = new Sauce({
		userId: parsedSauce.userId,
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