
var mongoose = require('mongoose');

var requiredMsg = '{PATH} is required.';
var ConnectSchema = mongoose.Schema({
    CustomerChatID: { type: Number, required: requiredMsg },
    DoctorChatID: { type: Number, required: requiredMsg },
    ExpireDate : { type: Date, required: requiredMsg },
    CreatedOn: { type: Date, required: requiredMsg },
    IsActive: { type: Boolean, required: requiredMsg },
    ModifiedOn: { type: Date }
});

var ConnectDoctorToCustomer = mongoose.model('ConnectDoctorToCustomer', ConnectSchema);