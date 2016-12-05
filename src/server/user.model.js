var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    user: String,
    currency: Array,
    stocks: Array
});

var User = mongoose.model('User', userSchema);

module.exports = User;
