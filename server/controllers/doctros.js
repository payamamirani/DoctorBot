
var DoctorModel = require('mongoose').model('Doctors');

exports.getAllDoctors = function (req, res) {
    DoctorModel.find({}).exec(function (err, doctors) {
        res.send(doctors);
    });
};

exports.getDoctorById = function (req, res) {
    DoctorModel.findOne({_id: req.params.id}).exec(function (err, doctor) {
        res.send(doctor);
    });
};

exports.createDoctor = function (req, res) {
    var doctorData = req.body;
    doctorData.CreatedOn = Date.now();
    doctorData.CreatedBy = req.user[0].Username;

    DoctorModel.create(doctorData, function (err, doctor) {
        if(err) {
            res.status(400);
            return res.send({reason: err.toString()});
        } else {
            return res.send({success: true, doctor: doctor});
        }
    });
};

exports.updateDoctor = function (req, res) {
    var doctorData = req.body;
    doctorData.ModifiedOn = Date.now();
    doctorData.ModifiedBy = req.user[0].Username;

    DoctorModel.findOneAndUpdate({_id: doctorData._id}, doctorData,{new: true}, function (err, doctor) {
        if(err) {
            res.status(400);
            return res.send({reason: err.toString()});
        } else {
            return res.send({success: true, doctor: doctor});
        }
    });
};