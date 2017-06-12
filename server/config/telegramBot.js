
var ExpertiseModel = require('mongoose').model('Expertise'),
    DoctorsModel = require('mongoose').model('Doctors'),
    TelegramMessageModel = require('mongoose').model('TelegramMessage'),
    TelegrafErrorModel = require('mongoose').model('TelegrafError'),
    ConnectDoctorToCustomerModel = require('mongoose').model('ConnectDoctorToCustomer'),
    Telegraf = require('telegraf'),
    { Router, Extra, Markup } = require('telegraf');

module.exports = function (config) {

    var getBackDoctorAvailable = function() {
        ConnectDoctorToCustomerModel.find({$and:[{IsActive: true}, {ExpireDate: { $lt: Date.now() }}]}, function(err, connects) {
            if(err || !connects || connects.length == 0) return;
            var chatIds = [];
            for(var c in connects)
                chatIds.push(connects[c].DoctorChatID);
            DoctorsModel.update({ChatID:{$in: chatIds}}, {$set:{IsAvailable: true}}, {multi:true}, function(err) {
                if(err) return;
                ConnectDoctorToCustomerModel.update({$and:[{IsActive: true}, {ExpireDate: { $lt: Date.now() }}]},
                    {$set:{IsActive: false}}, {multi: true}, function(err) {
                });
            });
        });
    };

    setInterval(getBackDoctorAvailable, 5000);

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

    bot.hears(/\/add 09([0-9]{9})/, function(ctx) {
        DoctorsModel.findOneAndUpdate({CellNo: ctx.match[0].substr(5)}, {$set:{ChatID: ctx.message.chat.id}}, {new: true}, function(err, doc) {
            if(err) return;
            return ctx.reply("ثبت با موفقیت انجام شد.");
        });
    });

    bot.on('callback_query', simpleRouter.middleware())

    simpleRouter.on("Expertise", function(ctx) {
        ExpertiseModel.findOne({_id: ctx.state.id}, function(err, exp) {
            DoctorsModel.find({Expertise: exp.Title, IsActive: true, IsAvailable: true}, function(err, doctors) {
                var docs = [];
                for(var doc in doctors)
                    if(!!doctors[doc].ChatID)
                        docs.push(Markup.callbackButton("دکتر " + doctors[doc].FullName, "Doctor:" + doctors[doc]._id.toString()));
                return ctx.reply("لیست دکتر های متخصص " + exp.Title, Markup.inlineKeyboard(docs).extra());
            });
        });
    })

    simpleRouter.on("Doctor", function(ctx) {
        DoctorsModel.findById(ctx.state.id, function(err, doci) {
            if(err || !doci.IsAvailable) return ctx.reply("متاسفانه دکتر در دسترس نیست.");
            ConnectDoctorToCustomerModel.find({$and:[{IsActive: true}, {ExpireDate: { $gt: Date.now() }}, {$or: [{ CustomerChatID: ctx.update.callback_query.message.chat.id },{ DoctorChatID: ctx.update.callback_query.message.chat.id }]}]}, function(err, connects) {
                if(err) return ctx.reply("متاسفانه دکتر در دسترس نیست.");
                console.log(connects);
                if(!!connects && connects.length != 0) return ctx.reply("مکالمه با دکتری دیگر در حین مکالمه جاری امکان پذیر نیست.");
                DoctorsModel.update({_id: doci._id}, {$set:{IsAvailable: false}}, function(err) {
                    if(err) return;
                    ConnectDoctorToCustomerModel.create({
                        CustomerChatID: ctx.update.callback_query.message.chat.id,
                        DoctorChatID: doci.ChatID,
                        ExpireDate: Date.now() + (1 * 60 * 1000),
                        IsActive: true,
                        CreatedOn : Date.now()
                    }, function(err , d) {
                        if(err) return ctx.reply();
                        return ctx.reply("شروع گفتگو با دکتر " + doci.FullName);
                    });
                });
            });
        });
    });

    bot.on('message', function(ctx) {
        ConnectDoctorToCustomerModel.findOne({
            $and: [
                {IsActive: true},
                {ExpireDate: { $gt: Date.now() }},
                {$or: [
                    { CustomerChatID: ctx.update.message.chat.id },
                    { DoctorChatID: ctx.update.message.chat.id }
                ]}
            ]
        }, function(err, con) {
            if(err) return ctx.reply("مکالمه ای وجود ندارد.");
            if(!con) return ctx.reply("مکالمه پایان یافته است.");
            if(ctx.update.message.chat.id === con.CustomerChatID)
                return ctx.telegram.sendMessage(con.DoctorChatID, ctx.update.message.text);
            if(ctx.update.message.chat.id === con.DoctorChatID)
                return ctx.telegram.sendMessage(con.CustomerChatID, ctx.update.message.text);
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