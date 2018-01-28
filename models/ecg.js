const mongoose = require('mongoose');
//const config = require('../config/database');

const ecgSchema = mongoose.Schema({
  
    patient_id: {
      type: String,
      required: true
    },

    x: {
      type: Array,
      required: true
    },
    y: {
      type: Array,
      required: true
    },
    plotly_url:{
      type: String,
      required: true
    }    
});

const ECG = module.exports = mongoose.model('ecg', ecgSchema);

module.exports.getecg = function (callback) {
  ECG.find(callback);
}

module.exports.getecgByid = function (patient_id, callback) {
    ECG.findByname(patient_id, callback);
}


module.exports.addecg = function (newecg, callback) {

    ECG.create(newecg, callback);
}