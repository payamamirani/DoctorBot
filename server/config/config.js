
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
        httpsPort: process.env.HttpsPort || 443,
        telegramToken: process.env.TelegramToken || "372521757:AAFViBIIVXp7l3IvC6jz8oi-qhlNw88Yofo",
        db: process.env.MongoString || "mongodb://localhost/DoctorBot"
    };

    if(env === "development") {
        config.port = process.env.PORT || 3000;
    } else if(env === "production") {
        config.port = process.env.PORT || 80;
    }
    return config;
};