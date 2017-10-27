var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://dev_user:WjtWtZzkMZw9hzJuiNiz@ds231315.mlab.com:31315/skilltree');

//require additional routes
router.use("/class", require('./class'));



var dummyContent = {
	classes: [
	{id: 1, desc: "class 1"},
	{id: 2, desc: "class 2"},
	{id: 3, desc: "class 3"}
	]
};

// index routes
router.get("/", function(req, res) {
	// User not logged in, serve browse page
	//res.redirect("/browse");

   	// User logged in, serve user page
   	// Get user information from DB
   	var content = {
		user: {
			username: "Bob"
		},
		// pass data to clientside js to draw things
		// also knows if it whould draw avatar or class page
		client: {
			avatar_page: true,
			data: "Here we can submit all data that the clientside js needs to know"
		}
	};
	res.render("canvas_page", {
		content
   	});
});

router.get("/browse", function(req,res) {
	// Render browse view
	var content = {data: []};
	// Get data from DB and return
	mongoose.model('classes').find({}, function(err, classes){
		if (err) {
			// handle error
			console.log(err);
		}
		if (classes) {
			// found something
			classes.forEach(function(c){
				content.data.push(c);
			});
			res.render("browse", {
				content
	   		});
		}
		else {
			// no items found
			res.render("browse", {
				content
	   		});
		}
	});
});



module.exports = router;