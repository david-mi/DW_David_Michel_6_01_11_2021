const mongoose = require('mongoose');

// const sauceSchema = mongoose.Schema({
//     sauce: {type: String, required: true},
//     image: {type: String, required: true}
// })


const sauceSchema = mongoose.Schema({
    
    userId: {type: String, required: true},
    name: {type: String, required: true},        
    manufacturer: {type: String, required: true},        
    description: {type: String, required: true},        
    mainPepper: {type: String, required: true},                
    heat: {type: Number, min: 1, max: 10, required: true},        
    likes: {type: Number, default: 0, required: true},        
    dislikes: {type: Number, default: 0, required: true},        
    usersLiked: {type: Array, default: [], required: true},        
    usersDisliked: {type: Array, default: [],  required: true},   
    imageUrl: {type: String, required: true},     

})



module.exports = mongoose.model('Sauce', sauceSchema);