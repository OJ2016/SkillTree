var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://dev_user:WjtWtZzkMZw9hzJuiNiz@ds231315.mlab.com:31315/skilltree');


router.get("/:class_id", function(req,res) {
	// Class view of a single class

	var content = {
		user: {
			username: "Bob"
		},
		client: {
			avatar_page: true
		}
	};
	// Get class information from DB
	mongoose.model('classes').findOne({id: req.params.class_id}, function(err, classes){
		if (err) {
			// handle error
			console.log(err);
		}
		if (classes) {
			// found wanted class
			content.client.data = classes.content;
			res.render("canvas_page", {
				content
	   		});
		}
		else {
			// no items found
			res.render("canvas_page", {
				content
	   		});
		}
	});
	
});



  module.exports = router;