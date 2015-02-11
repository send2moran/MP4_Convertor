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


// accept PUT request at /user
app.get('/get/mp4', function (req, res) {
  //https%3A%2F%2Fapi-integration-c.whipclip.com%2Fv1%2Fmedia%2Fvideo%2Ftypes%2Fhls%2Fstreams%2Fus_hbo_hls_320p%3FmediaContext%3Da.dXNfaGJvfDE0MjMyNDczODAwMDB8MTQyMzI0NzQyNDAwMHwxNDIzNTY4NTk3NzYx.2b94643643c63b5502398ed3d48fcdfddce33cd431605a5c4681af997617d3c8%26startOffset%3D0%26endOffset%3D44000%26mediaSource%3DS3%26timestamp%3D1423546800000
  transcode(res,req.query.id,req.query.st, req.query.dur, req.query.pl);
})


// var server = app.listen(process.env.PORT || 3000, function () {
//   var host = server.address().address
//   var port = server.address().port
//   console.log('Example app listening at http://%s:%s', host, port)
// })



module.exports = app;
