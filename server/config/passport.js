
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    UserModel = require('mongoose').model('User');

module.exports = function () {
    passport.use(new LocalStrategy(function (username, password, done) {
        UserModel.findOne({Username: username}).exec(function(err, user) {
            if(err) {
                return done(err, false);
            } else if(user && user.authenticate(password)) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

    passport.serializeUser(function(user, done) {
        if(user) {
            done(null, user._id);
        }
    });

    passport.deserializeUser(function(id, done) {
        UserModel.find({_id: id}).exec(function(err, user) {
            if(err) {
                return done(err, false);
            } else if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    });
};