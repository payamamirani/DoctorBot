
var mongoose = require('mongoose');

var schema = mongoose.Schema({}, { strict: false });

var TelegramMessage = mongoose.model('TelegrafError', schema);