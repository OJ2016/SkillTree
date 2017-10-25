var express = require("express");
var path = require("path");
var app = express();
var fs = require('fs');

// configure app
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");

// use midleware
app.use(express.static(path.join(__dirname, "static")))


// read database models
fs.readdirSync(__dirname + '/models').forEach(function(filename){
	if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});


// load routes
app.use(require('./routes'))

var port = process.env.PORT || 8081;
app.listen(port, function() {
   console.log("App ready on port ", port)
});