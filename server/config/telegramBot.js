
var ExpertiseModel = require('mongoose').model('Expertise'),
    DoctorsModel = require('mongoose').model('Doctors'),
    TelegramMessageModel = require('mongoose').model('TelegramMessage'),
    Telegraf = require('telegraf'),
    { Extra, Markup } = require('telegraf');

module.exports = function (config) {

    var bot = new Telegraf(config.telegramToken);
    bot.use(Telegraf.log());

    bot.use(function (ctx, next) {
        TelegramMessageModel.create(ctx.update, function(err, data){
            next();
        });
    });

    bot.command('start', function(ctx){
        ExpertiseModel.find({IsActive: true}).exec(function (err, expertise) {
            var titles = [];
            for(var ex in expertise)
                titles.push(expertise[ex].Title);
            ctx.reply("لیست تخصص ها", Markup.keyboard(titles).oneTime().resize().extra());
        });
    });

    bot.on('text', function(ctx) {
        DoctorsModel.find({Expertise: ctx.message.text, IsActive: true, IsAvailable: true}, function(err, doctors) {
            var docs = [];
            for(var doc in doctors)
                docs.push(doctors[doc].FullName);
            ctx.reply("لیست دکتر های متخصص " + ctx.message.text, Markup.keyboard(docs).oneTime().resize().extra());
        });
    });

    return bot;
};