
var multer = require('multer'),
    auth = require('./auth'),
    captcha = require('./captcha'),
    userController = require('../controllers/users'),
    expertiseController = require('../controllers/expertise'),
    doctorController = require('../controllers/doctros');

module.exports = function(app, config) {

    var upload = multer({ dest: config.templatePath });

    app.get('/api/doctors', doctorController.getAllDoctors);
    app.get('/api/doctors/:id', doctorController.getDoctorById);
    app.post('/api/doctors', auth.requireRole('admin'), doctorController.createDoctor);
    app.put('/api/doctors', auth.requireRole('admin'), doctorController.updateDoctor);

    app.get('/api/expertise', expertiseController.getAllExpertise);
    app.get('/api/expertise/:id', expertiseController.getExpertiseById);
    app.post('/api/expertise', auth.requireRole('admin'), expertiseController.createExpertise);
    app.put('/api/expertise', auth.requireRole('admin'), expertiseController.updateExpertise);

    app.get('/api/users', auth.requireRole('admin'), userController.getAllUsers);
    app.post('/api/users', auth.requireRole('admin'), userController.createUser);
    app.put('/api/users', auth.requireApiLogin, userController.updateUser);

    app.post('/api/forgotPassword', userController.forgotPassword);
    app.post('/api/resetPassword', userController.resetPassword);

    app.get('/partials/*', function (req, res) {
        res.render('../../public/app/' + req.params[0]);
    });

    app.post('/login', auth.authenticate);

    app.post('/logout', function (req, res) {
        req.logout();
        res.end();
    });

    app.get('/captcha', captcha.captcha);

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
};