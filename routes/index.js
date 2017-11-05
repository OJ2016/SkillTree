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
		   	// Get user information from DB
		   	var content = {
				user : req.user,
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



	function isLoggedIn(req, res, next) {

	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();

	    // if they aren't redirect them to the home page
	    res.redirect('/');
	}


};