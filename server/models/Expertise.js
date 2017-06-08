
var mongoose = require('mongoose');

var requiredMsg = '{PATH} is required.';
var ExpertiseSchema = mongoose.Schema({
    Title: {type: String, required: requiredMsg },
    IsActive: {type: Boolean, required: requiredMsg },
    CreatedOn: {type: Date, required: requiredMsg },
    CreatedBy: {type: String, required: requiredMsg },
    ModifiedOn: {type: Date },
    ModifiedBy: {type: String }
});

var Expertise = mongoose.model('Expertise', ExpertiseSchema);
function createDefaultExpertise() {
    Expertise.findOne({}).exec(function (err, expertise) {
        if (err) console.error(err);
        if (!expertise) {
            Expertise.create({
                Title: "عمومی",
                IsActive: true,
                CreatedOn: Date.now(),
                CreatedBy: "pm.amirani@gmail.com"
            });
        }
    });
}

exports.createDefaultExpertise = createDefaultExpertise;