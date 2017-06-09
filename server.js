
var express = require('express'),
    https = require('https'),
    http = require('http'),
    Telegraf = require('telegraf');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

var config = require('./server/config/config')(env);
var cert = require('./server/key/cert')(config);
var bot = new Telegraf(config.telegramToken);
bot.use(Telegraf.log());

require('./server/config/express')(app, config, bot);
require('./server/config/mongoose')(config);
require('./server/config/routes')(app, config);
require('./server/config/passport')();
require('./server/config/telegramBot')(bot);

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
