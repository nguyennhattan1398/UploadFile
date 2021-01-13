
var mongoose = require('mongoose');
  
var authorSchema = mongoose.Schema({
name: String,
pass: String, 
});
 
var Author = mongoose.model('users', authorSchema);
 
module.exports = Author;