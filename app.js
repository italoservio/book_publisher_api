var express = require('express');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authorRouter = require('./routes/author');
var genreRouter = require('./routes/genre');
var bookRouter = require('./routes/book');
var instanceRouter = require('./routes/instance');
var statusRouter = require('./routes/status');

var app = express();

app.use(logger('dev')); // Routes log
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/book', bookRouter);
app.use('/genre', genreRouter);
app.use('/status', statusRouter);
app.use('/author', authorRouter);
app.use('/instance', instanceRouter);

var port = 5000;
var server = http.createServer(app);
server.listen(port);
