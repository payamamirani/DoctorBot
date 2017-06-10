
var mongoose = require('mongoose'),
    UserModel = require('../models/User'),
    ExpertiseModel = require('../models/Expertise'),
    DoctorsModel = require('../models/Doctors'),
    TelegramMessageModel = require('../models/TelegramMessage');

module.exports = function(config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connecting to database error ...'));
    db.once('open', function callback(){
        console.log('Database opened.');
    });
    UserModel.createDefaultUsers();
    ExpertiseModel.createDefaultExpertise();
    DoctorsModel.createDefaultDoctors();
    TelegramMessageModel();
};