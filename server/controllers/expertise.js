
var ExpertiseModel = require('mongoose').model('Expertise');

exports.getAllExpertise = function (req, res) {
    ExpertiseModel.find({}).exec(function (err, expertise) {
        res.send(expertise);
    });
};

exports.createExpertise = function (req, res) {
    var expertiseData = req.body;
    expertiseData.CreatedOn = Date.now();
    expertiseData.CreatedBy = req.user[0].Username;

    ExpertiseModel.create(expertiseData, function (err, expertise) {
        if(err) {
            return res.status(400).send({reason: err.toString()});
        } else {
            return res.send({success: true, expertise: expertise});
        }
    });
};

exports.updateExpertise = function (req, res) {
    res.send({ok:true});
};