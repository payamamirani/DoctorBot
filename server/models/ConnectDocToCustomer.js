
var mongoose = require('mongoose');

var requiredMsg = '{PATH} is required.';
var ConnectSchema = mongoose.Schema({
    CustomerChatID: { type: Number, required: requiredMsg },
    DoctorChatID: { type: Number, required: requiredMsg },
    ExpireDate : { type: Date, required: requiredMsg },
    IsActive: { type: Boolean, required: requiredMsg },
    CreatedOn: { type: Date, required: requiredMsg },
    ModifiedOn: { type: Date }
});

var Doctors = mongoose.model('Doctors', DoctorSchema);
function createDefaultDoctors() {
    Doctors.findOne({}).exec(function (err, doctor) {
        if (err) console.error(err);
        if (!doctor) {
            Doctors.create({
                CellNo: "09357574769",
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