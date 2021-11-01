const mongoose = require('mongoose');
// pour renforcer le fait de pouvoir inscire qu'un seul mail
// en complément de unique: true
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'pas bon du tout'

const userSchema = mongoose.Schema({
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true}        
})

// On applique le plugin sur notre schéma avant de l'exporter
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);