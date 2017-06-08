
var nodeMailer = require('nodemailer');

var SMTP = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: '',
        pass: ''
    }
};

var transporter = nodeMailer.createTransport(SMTP);

exports.SendMail = function(to, subject, body, callback) {
    var mailoptions = {
        from: '"Doctor Bot"',
        to: to,
        subject: subject,
        html: body
    };

    transporter.sendMail(mailoptions, callback);
};


