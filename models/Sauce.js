const mongoose = require('mongoose');
var validate = require('mongoose-validator');

var stringVal = [
    validate({
      validator: 'isLength',
      arguments: [2, 30],
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
      validator: val => !/[$\/<>;]/.test(val),
      message: 'Forbidden caracters',
    }),
]

const sauceSchema = mongoose.Schema({
    
    userId: {type: String, required: true, validate: stringVal, trim: true},
    name: {type: String, required: true, validate: stringVal, trim: true},        
    manufacturer: {type: String, required: true, validate: stringVal, trim: true},        
    description: {type: String, required: true, validate: stringVal, trim: true},        
    mainPepper: {type: String, required: true, validate: stringVal, trim: true},                
    heat: {type: Number, min: 1, max: 10, required: true, trim: true},        
    likes: {type: Number, default: 0, required: true},        
    dislikes: {type: Number, default: 0, required: true},        
    usersLiked: {type: Array, default: [], required: true},        
    usersDisliked: {type: Array, default: [], required: true},   
    imageUrl: {type: String, required: true},     

})

module.exports = mongoose.model('Sauce', sauceSchema);

// console.log(sauceSchema)