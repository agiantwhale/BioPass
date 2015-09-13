var express = require('express'),
    cors = require('cors'),
    fs=require('fs'),
    shortid=require('shortid'),
    http=require('http'),
    https=require('https'),
	app = express(),
	multer = require('multer'); //handle multi-part form-data


var upload = multer({ dest: 'public/' })
var bodyParser = require('body-parser');
var jsonparser = bodyParser.json({limit:'50mb'});

var options = {
  key: fs.readFileSync('ssl.key'),
  cert: fs.readFileSync('ssl.cert')
};

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))

// parse application/json
app.use(bodyParser.json({limit:'50mb'}))

app.get('/', function(req, res){
  res.send('hi this is the front page');
});

app.post('/upload-wav', function(req, res){
  if(!req.body) return res.sendStatus(400);

  var base64Data = req.body.data.replace(/^data:audio\/wav;base64,/, '');
  var fileName=shortid.generate()+'.wav';
  var filePath='public/'+fileName;
  fs.writeFile(filePath, base64Data, 'base64', function(err) {
    if(err) return res.json({'status': 'error'});
    else {
      //return res.json({'status': 'success'});
    }
  });
});

var requests={};
app.post('/share', function(req, res) {
  var id=shortid.generate();
  console.log('Id generated: '+id);
  requests[id]=false;
  return res.json({'status':'success','id':id});
});
app.get('/check/:shortid', function(req, res) {
  return res.json({'status':'success','done':requests[req.params.shortid]});
});
app.get('/auth/:shortid', function(req, res) {
  return res.send('<!doctype html><html lang="en"><head>  <meta charset="utf-8">  <title>BioAuth</title>  <meta name="description" content="BioAuth">  <meta name="author" content="BioAuth">  </head><body></body></html>');
});
app.post('/auth/:shortid', function(req, res) {
  var shortid=req.params.shortid;
  requests[shortid]=true;
  return res.json({'status':'success','id':shortid});
});

console.log('running server on port 3000');
http.createServer(app).listen(80);
https.createServer(options, app).listen(3001);
