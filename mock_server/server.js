var express = require('express'),
	app = express(),
	multer = require('multer'); //handle multi-part form-data
var upload = multer({ dest: 'public/' })
var bodyParser = require('body-parser');
var jsonparser = bodyParser.json();

/*
app.post("/upload-wav", upload.single('wav-file'), function (request, response) {  
	upload(request, response, function(err)	{
		if (err) {
			console.error(err);
			response.status(400);
		}
		console.log('file being uploaded');
		console.log("file name", request.files.file.name);    
		console.log("file path", request.files.file.path);
		response.end("upload complete"); 
})});
*/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.get('/', function(req, res){
	res.send('hi this is the front page');
});

app.post('/upload-wav', function(req, res){
	if(!req.body)
		return res.sendStatus(400);
	console.log('yo we got a req');
	console.log(req.body);
	var buf = new Buffer(req.body.blob, 'base64'); // decode
	fs.writeFile("public/test.wav", req.body, function(err) {
		if(err) {
		  console.log("err", err);
		} else {
		  return res.json({'status': 'success'});
		}
	}) 
});

console.log('running server on port 3000');
app.listen(3000);
