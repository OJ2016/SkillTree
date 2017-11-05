var express = require("express");
var app = express();
var path = require("path");
var fs = require('fs');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');


// Connect Databse
var config = require('./config/secret.js').get(process.env.NODE_ENV);
mongoose.connect(config.database);

require('./config/passport')(passport,config);


// configure app
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");

// use midleware
app.use(express.static(path.join(__dirname, "static")))

// required for passport
app.use(session({ secret: config.session.secret})); 
app.use(passport.initialize());
app.use(passport.session());

// read database models
fs.readdirSync(__dirname + '/models').forEach(function(filename){
	if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});


// load routes
require('./routes/index.js')(app, passport);

var port = process.env.PORT || 8081;
app.listen(port, function() {
   console.log("App ready on port ", port)
});