var express = require('express');
var mongoose = require('mongoose');

module.exports = function(app, passport) {


	// index routes
	app.get("/", function(req, res) {
		// User not logged in, serve browse page
		if (!req.isAuthenticated()) {
			res.redirect("/browse");
		}
		else {
		   	// User logged in, serve user page
		   	// get saved states from user and extract all classes needed
			var state = req.user.saved_state;
		   	var class_ids = findUserTrees(state);

		   	// content container
		   	var content = {
				user : req.user,
				client: {
					saved_state: state,
					data: []
				}
			};

		   	// find all classes user has selected and render site
		   	mongoose.model('classes').find({id: { $in: class_ids}}, function(err, classes){
				if (err) {
					// handle error
					console.log(err);
				}
				if (classes) {
					// found something
					classes.forEach(function(c){
						content.client.data.push(c);
					});
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
		};
	});

	// browse
	app.get("/browse", function(req,res) {
		// Render browse view
		var content = {
			user : req.user,
			data: []
		};
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

	// one class page
	app.get("/class/:class_id", function(req,res) {
		// Class view of a single class

		var content = {
			user : req.user,
			client: {}
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

	// Serve login page
	app.get('/login', function(req,res) {
		res.render('login');
	});

	// Listen login 
	app.post('/login', function(req, res) {

	});

	// logout
	app.get('/logout', function(req,res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	// the callback after google has authenticated the user
	app.get('/auth/google/callback',
		passport.authenticate('google', {
	        successRedirect : '/',
	        failureRedirect : '/'
	}));

	// post listener to AJAX save request
	// format of ajax call below
	//$.ajax({
    //    type: 'POST',
    //    url: '/save',
    //    dataType: 'json',
    //    data: {'state': "['1','1.0','2','2.0','2.1']"},
	//});

	app.post('/save', function(req,res) {
		var state = req.body.state;
		console.log(state);
		if (req.isAuthenticated()) {
			var query = {"google.email" : req.user.google.email};
			mongoose.model('User').findOneAndUpdate(query, {"saved_state" : state}, function(err, doc){
				if (err) {
					// handle error
					console.log(err);
				}
			});
		} else {
			// error
		}
	});


	function isLoggedIn(req, res, next) {

	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();

	    // if they aren't redirect them to the home page
	    res.redirect('/');
	};

	function findUserTrees(saved_state) {
		saved_state = saved_state.replace(/['[\]\\]/g, "");
		saved_state = saved_state.split(",");
		var id_array = [];
		for (i=0;i<saved_state.length;i++) {
			if (saved_state[i].indexOf(".") == -1) {
				id_array.push(Number(saved_state[i]));
			}
		}
		return id_array;
	}

};


