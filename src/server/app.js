var express = require('express');
var path = require('path');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').Server(app);
var jwt = require('express-jwt'); //json web tokens for authorization
var cors = require('cors'); //required for cross origin requests from auth0

app.use(cors());
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname + '/../../dist'));
app.use('/', express.static(__dirname + '/../public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

//auth0 authentication
//you must sign up for a free account at auth0.com to get these keys
var auth0Secret = 'g0Ha8D0mM6TJrTZIfxxz6Ey4ewb2gX7wDJK8daUum09ywGueaLqhF2ti2kMmL-nc';
var auth0ClientId = 'tryydia9RW5tOc27TNg3sacg32RNjNcf';
var authCheck = jwt({
  secret: new Buffer(auth0Secret, 'base64'),
  audience: auth0ClientId
});

//initiate db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
mongoose.Promise = global.Promise;

// Models
var User = require('./user.model.js');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');

  //APIs
  // select all
  app.get('/users', function(req, res) {
    Chat.find({}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });

  // create a new user
  app.post('/user', function(req, res) {
    var obj = new User(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/user/:id', function(req, res) {
    Chat.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    });
  });

  // update by id (push new message to chat object)
  app.put('/chat/:id', function(req, res) {
    Chat.findByIdAndUpdate(
      {_id: req.params.id},
      {$push: {"stocks": req.body.stocks}},
      {$push: {"currency": req.body.currency}},
      {safe: true, upsert: true},
      function(err, model) {
        if(err) return console.error(err);
        res.sendStatus(200);
      }
    );
  });

  // delete by id
  app.delete('/chat/:id', function(req, res) {
    Chat.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });

  // all other routes are handled by Angular
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname,'/../../dist/index.html'));
  });

  http.listen(app.get('port'), function() {
    console.log('Angular 2 Full Stack C2B Chat listening on port '+app.get('port'));
  });
});

module.exports = app;
