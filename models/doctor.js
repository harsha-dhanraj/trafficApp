const mongoose = require('mongoose');
const doctorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    specialization:{
        type:String,
        required:true
    },
    contact_number:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Doctor = module.exports = mongoose.model('doctor', doctorSchema);

module.exports.addDoctor = (doctor, callback) => {
    //console.log("Comming here in addDoctor....")
    //console.log(doctor);
    Doctor.create(doctor, callback);
}

module.exports.getDoctorbyEmail = (email, callback) => {
  console.log("Email is : "+email);
  var query = {
    email: email
  }
    Doctor.find(query, callback);  
}