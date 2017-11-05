var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// schema for a user
var usersSchema = new Schema({
	google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },

	saved_state: String
});

module.exports = mongoose.model('User', usersSchema);