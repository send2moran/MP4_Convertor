#!/usr/bin/env node

var opts = require('minimist')(process.argv.slice(2));
var player = require('chromecast-player')();
var transcode = require('./plugins/transcode');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');

var app = express();

app.use(session({
  secret: '543%#$^@#^@^546456456'
}));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data




app.get('/', function (req, res) {
  res.send('Hello World!');
})

// accept POST request on the homepage
app.post('/', function (req, res) {
  var video = '';
  var id = req.body.id;
  if(!req.session.videoArr){
    video = req.session.videoArr = {};
  }
  video = req.session.videoArr[id] = (video = req.body.video);
  res.send('video set');
})

// accept PUT request at /user
app.get('/mp4', function (req, res) {
  var video = req.session.videoArr && req.session.videoArr[req.query.id];
  if(!video){
    res.write('no video found');
    res.end();
  }
  video = req.session.videoArr[req.query.id];
  transcode(res,video);
})

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})



//module.exports = player;
