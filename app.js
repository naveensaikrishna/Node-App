var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
  res.sendFile(__dirname+"/views/index.html")
});


app.get('/extension', (req,res) => {
  res.sendFile(__dirname+"/views/extension.html")
});

let connections = require('./routes/connections');
let schemas = require('./routes/schemas');
let users = require('./routes/users');
let config = require('./routes/config');

app.use('/connections', connections)
app.use('/schemas', schemas)
app.use('/users', users)

app.use('/config', config)

let savedata = require('./data/savedata.js')

app.post('/savedata', savedata.savedata);

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
})

module.exports = app