//init
var http = require('http');
var port = 3001 ;
var now  = new Date();
var express= require('express');
var app = express();

// create server
app.use(express.static(__dirname + "/public"));
app.listen(port)
