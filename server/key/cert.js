
var fs = require('fs');

module.exports = function (config) {
    var certificate = {
        key:  fs.readFileSync(config.keyPath + '/private.key'),
        cert: fs.readFileSync(config.keyPath + '/public.pem'),
        ca: [
            fs.readFileSync(config.keyPath + '/public.pem')
        ]
    };
    return certificate;
};