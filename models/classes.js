var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// schema for a class
var classesSchema = new Schema({
	name: String,
	id: Number,
	icon: String,
	description: String,
	content: String
});

module.exports = mongoose.model('classes', classesSchema);