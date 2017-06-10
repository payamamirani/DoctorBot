
var path = require('path');

var rootPath = path.normalize(path.join(__dirname, '../..'));
var publicPath = path.normalize(path.join(rootPath, 'public'));
var viewPath = path.normalize(path.join(rootPath, 'server/views'));
var localesPath = path.normalize(path.join(publicPath, 'locales'));
var templatePath = path.normalize(path.join(publicPath, 'templateFile'));
var siteImagePath = path.normalize(path.join(publicPath, 'siteImages'));
var keyPath = path.normalize(path.join(rootPath, 'server', 'key'));

module.exports = function(env) {
    var config = {
        rootPath: rootPath ,
        publicPath: publicPath ,
        viewPath: viewPath ,
        localesPath: localesPath,
        templatePath: templatePath,
        siteImagePath: siteImagePath,
        keyPath: keyPath,
        httpsPort: 443,
        telegramToken: "372521757:AAFViBIIVXp7l3IvC6jz8oi-qhlNw88Yofo"
    };

    if(env === "development") {
        config.db = "mongodb://localhost/DoctorBot";
        config.port = process.env.PORT || 80;
    } else if(env === "production") {
        config.db = "mongodb://appuser:multivision123@ds027145.mlab.com:27145/multivision";
        config.port = process.env.PORT || 8000;
    }
    return config;
};