
var passport = require('passport'),
    captcha = require('./captcha');

exports.authenticate = function(req, res, next) {
    if(!captcha.isValidCaptcha(req, req.body.captcha))
        return res.send({success: false, error: req.i18n_texts.InvalidSecurityCode});

    req.body.username = req.body.username.toLowerCase();
    var auth = passport.authenticate('local', function(err, user) {
        if(err) return next(err);
        if(!user) res.send({ success: false });
        req.logIn(user, function(err) {
            if(err) return next(err);
            req.session.cookie.expires = !!req.body.remember ? 365 * 24 * 60 * 60 * 1000 : false;
            res.send({success: true, user: user});
        });
    });
    auth(req, res, next);
};

exports.requireApiLogin = function (req, res, next) {
    if(!req.isAuthenticated()){
        res.status(403);
        res.end();
    } else {
        next();
    }
};

exports.requireRole = function (role) {
    return function(req, res, next) {
        if(!req.isAuthenticated() || req.user[0].Roles.indexOf(role) === -1) {
            res.status(403);
            res.end();
        } else {
            next();
        }
    };
};