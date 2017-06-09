
var ExpertiseModel = require('mongoose').model('Expertise');

exports.getAllExpertise = function (req, res) {
    ExpertiseModel.find({}).exec(function (err, expertise) {
        res.send(expertise);
    });
};

exports.getExpertiseById = function (req, res) {
    ExpertiseModel.findOne({_id: req.params.id}).exec(function (err, expertise) {
        res.send(expertise);
    });
};

exports.createExpertise = function (req, res) {
    var expertiseData = req.body;
    expertiseData.CreatedOn = Date.now();
    expertiseData.CreatedBy = req.user[0].Username;

    ExpertiseModel.create(expertiseData, function (err, expertise) {
        if(err) {
            res.status(400);
            return res.send({reason: err.toString()});
        } else {
            return res.send({success: true, expertise: expertise});
        }
    });
};

exports.updateExpertise = function (req, res) {
    var expertiseData = req.body;
    expertiseData.ModifiedOn = Date.now();
    expertiseData.ModifiedBy = req.user[0].Username;

    ExpertiseModel.findOneAndUpdate({_id: expertiseData._id}, expertiseData,{new: true}, function (err, expertise) {
        if(err) {
            res.status(400);
            return res.send({reason: err.toString()});
        } else {
            return res.send({success: true, expertise: expertise});
        }
    });
};