
var ExpertiseModel = require('mongoose').model('Expertise'),
    { Extra, Markup } = require('telegraf');

module.exports = function (bot) {

    bot.command('start', function({ reply }){
        ExpertiseModel.find({IsActive: true}).exec(function (err, expertise) {
            var titles = [];
            for(var ex in expertise)
                titles.push(expertise[ex].Title);
            reply("لیست تخصص ها :", Markup.keyboard(titles).oneTime().resize().extra());
        });
    });
};