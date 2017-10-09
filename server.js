var express = require("express");
var path = require("path");

var app = express();


// configure app
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");

// use midleware
app.use(express.static(path.join(__dirname, "static")))

// define routes

var dummyContent = {
	classes: [
	{id: 1, desc: "class 1"},
	{id: 2, desc: "class 2"},
	{id: 3, desc: "class 3"}
	]
};

app.get("/", function(req, res) {
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

app.get("/browse", function(req,res) {
	// Render browse view
	// Get data from DB and return
	var content = dummyContent
	res.render("browse", {
		content
   	});
});

app.get("/class/:class_id", function(req,res) {
	// Class view of a single class
	// Get class information from DB
	var content = {
		user: {
			username: "Bob",
		},
		// pass data to clientside js to draw things
		// also knows if it whould draw avatar or class page
		client: {
			avatar_page: false,
			data: "Here we can submit all data that the clientside js needs to know",
			class: {
				id: req.params.class_id
			}
			
		}
	};
	res.render("canvas_page", {
		content
   	});
})

var port = process.env.PORT || 8081;
app.listen(port, function() {
   console.log("App ready on port ", port)
});