var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');

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

app.get('/', function(req, res) {
  res.sendFile('/public/index.html');
})

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
})

app.listen(5000);
console.log('working');
