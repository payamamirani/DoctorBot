
var ExpertiseModel = require('mongoose').model('Expertise'),
    DoctorsModel = require('mongoose').model('Doctors'),
    TelegramMessageModel = require('mongoose').model('TelegramMessage'),
    TelegrafErrorModel = require('mongoose').model('TelegrafError'),
    Telegraf = require('telegraf'),
    { Router, Extra, Markup } = require('telegraf');

module.exports = function (config) {

    var bot = new Telegraf(config.telegramToken);
    bot.use(Telegraf.log());
    bot.use(function (ctx, next) {
        TelegramMessageModel.create(ctx.update, function(err, data){
            next();
        });
    });

    var simpleRouter = new Router(function(ctx) {
        if (!ctx.callbackQuery.data) {
            return Promise.resolve()
        }
        var parts = ctx.callbackQuery.data.split(':')
        return Promise.resolve({
            route: parts[0],
            state: {
                id: parts[1]
            }
        });
    });

    bot.command('start', function(ctx) {
        ExpertiseModel.find({IsActive: true}, function (err, expertise) {
            var titles = [];
            for(var ex in expertise)
                titles.push(Markup.callbackButton(expertise[ex].Title, "Expertise:" + expertise[ex]._id.toString()));
            ctx.reply("لیست تخصص ها", Markup.inlineKeyboard(titles, {columns: 2}).extra());
        });
    });

    bot.hears(/\/add 09(\d+[9])/, function(ctx) {
        DoctorsModel.findOneAndUpdate({CellNo: ctx.match[0].substr(5)}, {$set:{"ChatID": ctx.message.chat.id}}, {new: true}, function(err, doc) {
            if(!err) return ctx.reply("ثبت با موفقیت انجام شد.");
        });
    });

    bot.hears('Test', function(ctx) {
        
    });

    bot.on('callback_query', simpleRouter.middleware())

    simpleRouter.on("Expertise", function(ctx) {
        ExpertiseModel.findOne({_id: ctx.state.id}, function(err, exp) {
            DoctorsModel.find({Expertise: exp.Title, IsActive: true, IsAvailable: true}, function(err, doctors) {
                var docs = [];
                for(var doc in doctors)
                    docs.push(Markup.callbackButton("دکتر " + doctors[doc].FullName, "Doctor:" + doctors[doc]._id.toString()));
                return ctx.reply("لیست دکتر های متخصص " + exp.Title, Markup.inlineKeyboard(docs).extra());
            });
        });
    })

    simpleRouter.on("Doctor", function(ctx) {
        DoctorsModel.findOne({_id: ctx.state.id}, function(err, doci) {
            return ctx.reply("باشه بابا برات وقت گذاشتم.");
        });
    });

    bot.catch(function(err) {
        console.log(err);
        TelegrafErrorModel.create(err, function(ex, e) {
            if(ex) console.error(ex);
        });
    });

    bot.startPolling();

    return bot;
};