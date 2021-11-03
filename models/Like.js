const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
  like: {type: Number, required: true},
  userId: {type: String, required: true}
})

module.exports = mongoose.model('Like', likeSchema);