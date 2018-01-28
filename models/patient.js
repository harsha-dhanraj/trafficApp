const mongoose = require('mongoose');
const patientSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    suffering_from:{
        type:String,
        required:true
    },
    personal_contact_number:{
        type: String,
        required: true
    },
    emergency_contact_number:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    doctor_id:{
        type:String,
        required:true
    }
    // plotly_url: {
    //   type: String,      
    // }
});

const Patient = module.exports = mongoose.model('patient', patientSchema);

module.exports.addPatient = (patient, callback) => {
    console.log("Comming here in addPatient....")
    console.log(patient);
    Patient.create(patient, callback);
}

module.exports.getPatientbyEmail = (email, callback) => {
  console.log("Email is : "+email);
  var query = {
    email: email
  }
    Patient.find(query, callback);  
}
