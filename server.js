
var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

var config = require('./server/config/config')(env);
require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/routes')(app, config);
require('./server/config/passport')();

app.use(function (err, req, res, next) {
    console.log(err);
    console.log(err.stack);
});

app.listen(config.port, function(){
    console.log('Listening on port ' + config.port + ' .');
});
