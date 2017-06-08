
var svgCaptcha = require('svg-captcha');

var createCaptcha = function() {
    var captcha = svgCaptcha.create({
        size: 5,
        ignoreChars: '01iIloO',
        color: true,
        background: "#f5f5f5",
        noise: 2
    });

    return captcha;
};

exports.captcha = function(req, res) {
    var captcha = createCaptcha();
    req.session.captcha = captcha.text.toLowerCase();
    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
};

exports.isValidCaptcha = function (req, c) {
    var isValid = true;
    if(req.session.captcha !== c.toLowerCase()) {
        isValid = false;
    }
    var captcha = createCaptcha();
    req.session.captcha = captcha.text.toLowerCase();
    return isValid;
};