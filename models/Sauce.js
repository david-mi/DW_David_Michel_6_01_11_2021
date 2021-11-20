const mongoose = require('mongoose');

const noChars = entry => /[$\/<>;]/.test(entry) ? false : true

const sauceSchema = mongoose.Schema({
    
    userId: {
      type: String, 
      validate: [noChars, 'Caractères interdits'],
      trim: true,
      required: true
    },
    name: {
      type: String, 
      validate: [noChars, 'Caractères interdits'],
      trim: true,
      minLength: 2,
      maxLength: 15,
      required: true
    },        
    manufacturer: {
      type: String, 
      validate: [noChars, 'Caractères interdits'],
      trim: true,
      minLength: 2,
      maxLength: 30,
      required: true
    },        
    description: {
      type: String, 
      validate: [noChars, 'Caractères interdits'],
      trim: true,
      minLength: 2,
      maxLength: 150,
      required: true
    },        
    mainPepper: {
      type: String, 
      validate: [noChars, 'Forbidden caracters'], 
      trim: true,
      minLength: 2,
      maxLength: 30,
      required: true
    },                
    heat: {
      type: Number,
      min: 1, 
      max: 10, 
      trim: true, 
      required: true
    },        
    likes: {type: Number, default: 0, required: true},        
    dislikes: {type: Number, default: 0, required: true},        
    usersLiked: {type: Array, default: [], required: true},        
    usersDisliked: {type: Array, default: [], required: true},   
    imageUrl: {type: String, required: true}     

})

module.exports = mongoose.model('Sauce', sauceSchema);

