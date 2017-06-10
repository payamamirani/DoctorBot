
var express = require('express'),
    https = require('https'),
    http = require('http');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

var config = require('./server/config/config')(env);
var cert = require('./server/key/cert')(config);
require('./server/config/mongoose')(config);
var bot = require('./server/config/telegramBot')(config);
require('./server/config/express')(app, config, bot);
require('./server/config/routes')(app, config);
require('./server/config/passport')();


app.use(function (err, req, res, next) {
    console.log(err);
    console.log(err.stack);
});

https.createServer(cert, app).listen(config.httpsPort, function(){
    console.log('https Listening on port ' + config.httpsPort + ' .');
});
http.createServer(app).listen(config.port, function () {
    console.log('http Listening on port ' + config.port + ' .');
});
