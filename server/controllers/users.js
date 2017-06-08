
var UserModel = require('mongoose').model('User'),
    encryption = require('../utilities/encryption'),
    mail = require('../config/mail'),
    jDate = require('jdate').JDate(),
    queryString = require("querystring"),
    captcha = require('../config/captcha');

exports.getAllUsers = function (req, res) {
    UserModel.find({}).exec(function (err, users) {
        res.send(users);
    });
};

exports.createUser = function(req, res, next) {
    var userData = req.body;
    userData.Username = userData.Username.toLowerCase();
    userData.Salt = encryption.createSalt();
    userData.HashPassword = encryption.hashPassword(userData.Salt, userData.Password);

    UserModel.create(userData, function (err, user) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error("Duplicate Username");
            }
            res.status(400);
            return res.send({reason: err.toString()});
        } else {
            req.login(user, function (err) {
                if (err) return next(err);
                res.send(user);
            });
        }
    });
};

exports.updateUser = function (req, res) {
    var userUpdates = req.body;
    if(req.user[0]._id != userUpdates._id) {
        res.status(403);
        return res.end();
    }

    if(!captcha.isValidCaptcha(req, userUpdates.captcha)) {
        res.status(400);
        return res.send({success: false, error: req.i18n_texts.InvalidSecurityCode});
    }

    req.user[0].FirstName = userUpdates.FirstName;
    req.user[0].LastName = userUpdates.LastName;
    req.user[0].Username = userUpdates.Username;
    if(userUpdates.Password && userUpdates.Password.length > 0) {
        if(!req.user[0].authenticate(userUpdates.CurrentPassword)) {
            res.status(400);
            return res.send({success: false, error: req.i18n_texts.CurrentPasswordIsIncorrect});
        }

        if(userUpdates.Password !== userUpdates.ConfirmPassword) {
            res.status(400);
            return res.send({success: false, error: req.i18n_texts.PasswordNotEqualWithConfirmPassword});
        }
        req.user[0].Salt = encryption.createSalt();
        req.user[0].HashPassword = encryption.hashPassword(req.user[0].Salt, userUpdates.Password);
    }
    req.user[0].save(function(err) {
        if(err) { res.status(400); return res.send({ success:false, error: err.toString() }); }
        res.send({ success: true, data: req.user[0] });
    });
};

exports.forgotPassword = function(req, res) {
    var data = req.body;
    if(!captcha.isValidCaptcha(req, data.captcha))
        return res.send({success: false, error: req.i18n_texts.InvalidSecurityCode});

    data.username = data.username.toLowerCase();
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 2);
    var query = { Username: data.username };
    var update = { Token: encryption.createSalt(), TokenExpireDate: expireDate };
    var options = { new: true };

    UserModel.findOneAndUpdate(query, update, options, function(err, user) {
        if (err) return res.send({success: false, error: err.toString()});
        if (!user) return res.send({success: false, error: req.i18n_texts.UsernameNotFound});
        var date =  req.i18n_lang == "fa" ? jDate.toString('yyyy/MM/dd HH:mm:ss') : new Date().toLocaleString();
        var url = req.protocol + "://" + req.get('host') + "/resetpassword?u=" + user.Username + "&t=" + queryString.escape(user.Token);
        res.render('templates/forgotPassword', {Username: user.Username, Url: url, Date: date }, function(err, result) {
            if (err) return res.send({success: false, error: err.toString()});
            mail.SendMail(user.Username, req.i18n_texts.ResetPasswordEmailSubject, result, function (err) {
                if (err) return res.send({success: false, error: err.toString()});
                return res.send({success: true});
            });
        });
    });
};

exports.resetPassword = function(req, res) {
    try{
        var data = req.body;
        if(!captcha.isValidCaptcha(req, data.captcha))
            return res.send({success: false, error: req.i18n_texts.InvalidSecurityCode});

        if(data.password != data.confirmPassword)
            return res.send({success: false, error: req.i18n_texts.PasswordNotEqualWithConfirmPassword});

        data.username = data.username.toLowerCase();

        UserModel.findOne({ Username: data.username }, function(err, user) {
            if (err) return res.send({success: false, error: err.toString()});
            if (!user) return res.send({success: false, error: req.i18n_texts.UsernameNotFound});
            if (!(user.Token || user.TokenExpireDate)) return res.send({
                success: false,
                error: req.i18n_texts.UserTokenNotFound
            });
            if (user.TokenExpireDate - new Date() <= 0) return res.send({
                success: false,
                error: req.i18n_texts.UserTokenIsExpired
            });
            if (user.Token != data.token) return res.send({
                success: false,
                error: req.i18n_texts.TokenIsInvalid
            });

            user.Token = null;
            user.TokenExpireDate = null;
            user.Salt = encryption.createSalt();
            user.HashPassword = encryption.hashPassword(user.Salt, data.password);
            user.save(function(err) {
                if(err) return res.send({success: false, error: err.toString()});
                var date =  req.i18n_lang == "fa" ? jDate.toString('yyyy/MM/dd HH:mm:ss') : new Date().toLocaleString();
                var url = req.protocol + "://" + req.get('host') + "/signin";
                res.render('templates/successChangePassword', {Username: user.Username, Url: url, Date: date }, function(err, result) {
                    if (err) return res.send({success: false, error: err.toString()});
                    mail.SendMail(user.Username, req.i18n_texts.SuccessChangePasswordEmailSubject, result, function (err) {
                        if (err) return res.send({success: false, error: err.toString()});
                    });
                });
                return res.send({success: true});
            });
        });
    } catch(err) {
        return res.send({success: false, error: err.toString()});
    }
};