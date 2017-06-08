
var mongoose = require('mongoose'),
    encryption = require('../utilities/encryption');

var requiredMsg = '{PATH} is required.';
var UserSchema = mongoose.Schema({
    FirstName: {type: String, required: requiredMsg },
    LastName: {type: String, required: requiredMsg },
    Username: {type: String, required: requiredMsg, unique: true, lowercase: true },
    Salt: {type: String, required: requiredMsg },
    HashPassword: {type: String, required: requiredMsg },
    Token: String,
    TokenExpireDate: {type: Date},
    Roles: [String]
});

UserSchema.methods = {
    authenticate: function (passwordToMatch) {
        return encryption.hashPassword(this.Salt, passwordToMatch) === this.HashPassword;
    },
    hasRole: function (role) {
        return this.Roles.indexOf(role) > -1;
    }
};

var User = mongoose.model('User', UserSchema);
function createDefaultUsers() {
    User.findOne({}).exec(function (err, user) {
        if (err) console.error(err);
        if (!user) {
            var salt, pass;
            salt = encryption.createSalt();
            pass = encryption.hashPassword(salt, "1qaz!QAZ");
            User.create({ FirstName: "پیام", LastName: "امیرانی", Username: "pm.amirani@gmail.com", Salt: salt, HashPassword: pass, Roles: ['admin'] });
            salt = encryption.createSalt();
            pass = encryption.hashPassword(salt, "1qaz!QAZ");
            User.create({ FirstName: "علی", LastName: "مردانی", Username: "alimardani1994@gmail.com", Salt: salt, HashPassword: pass, Roles: ['admin'] });
        }
    });
}

exports.createDefaultUsers = createDefaultUsers;