var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var port = process.env.PORT || 5000;
var Uber = require('node-uber');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

var yelp = require("yelp").createClient({
  consumer_key: "pcvmB-XbNmyiuu1YaQ0wsw",
  consumer_secret: "s-_nYxipYIC-61Yzj6Fe8FvpuX0",
  token: "X_7aMxEqS18PBOiNrXa2f-qxuGfI4ZJf",
  token_secret: "xVc1FGsqLuOZw-BHPurnQtuAYv8"
});

var uber = new Uber({
  response_type: 'code',
  client_id: '7ULeqhQ8ZXDPnP8UFX7qQgHgCt0GO9Mz',
  client_secret: '0VS3dX4b5hSPyse5EQ5njRkC7t9LoVTlVDCaa2-Z',
  server_token: 'ZLWD2e6N66Lwe9bQE2FY1qcoXHFX8GfWbi1FwWTT'
});

app.get('/', function(req, res) {
  res.sendFile('/public/index.html');
});

app.get('/ll/:ll', function(req, res) {
  var ll = req.params.ll;
  console.log(ll);
  yelp.search({term: "food", ll: ll}, function(err, data) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.get('/uber/:llll', function(req, res) {
  var llll = req.params.llll.split(',');
  var startLat = llll[0];
  var startLong = llll[1];
  var endLat = llll[2];
  var endLong = llll[3];
  uber.estimates.price({
    start_latitude: startLat, start_longitude: startLong,
    end_latitude: endLat, end_longitude: endLong
  }, function(err, data) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(data);
      res.send(data)
    }
  })
});

app.get('/surge', function(req, res) {
  res.send('you will be charged a surge fee');
})

app.listen(port);
console.log('working on port ' + port);
