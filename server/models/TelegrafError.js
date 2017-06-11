
var mongoose = require('mongoose');

var schema = mongoose.Schema({}, { strict: false });

var TelegramMessage = mongoose.model('TelegrafError', schema);

module.exports = function () {
    return true;
};