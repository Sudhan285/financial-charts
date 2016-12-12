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
var auth0Secret = '8R3A3EOeAt26BFQ6V5ahmCeYBDd7ElkckGCSH4YoKWeQRYSPGDMokYe-aae1YSVX-nc';
var auth0ClientId = 'qymLfKiEP0M1bPMXchIR5Dbe0wrDH2yk';
var authCheck = jwt({
  secret: new Buffer(auth0Secret, 'base64'),
  audience: auth0ClientId
});

// all other routes are handled by Angular
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname,'/../../dist/index.html'));
});

http.listen(app.get('port'), function() {
  console.log('Angular 2 Full Stack C2B Chat listening on port '+app.get('port'));
});

module.exports = app;
