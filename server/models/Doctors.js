
var mongoose = require('mongoose');

var requiredMsg = '{PATH} is required.';
var DoctorSchema = mongoose.Schema({
    FullName: {type: String, required: requiredMsg },
    Fees: {type: Number, required: requiredMsg },
    Expertise: {type: String, required: requiredMsg },
    CellNo : {type: String, required: requiredMsg },
    IsAvailable: {type: Boolean, required: requiredMsg },
    IsActive: {type: Boolean, required: requiredMsg },
    CreatedOn: {type: Date, required: requiredMsg },
    CreatedBy: {type: String, required: requiredMsg },
    ChatID: {type: Number },
    ModifiedOn: {type: Date },
    ModifiedBy: {type: String }
});

var Doctors = mongoose.model('Doctors', DoctorSchema);
function createDefaultDoctors() {
    Doctors.findOne({}).exec(function (err, doctor) {
        if (err) console.error(err);
        if (!doctor) {
            Doctors.create({
                CellNo: "09357574769"
                FullName: "پیام امیرانی",
                Fees: 0,
                Expertise: "عمومی",
                IsAvailable: true,
                IsActive: true,
                CreatedOn: Date.now(),
                CreatedBy: "pm.amirani@gmail.com"
            });
        }
    });
}

exports.createDefaultDoctors = createDefaultDoctors;