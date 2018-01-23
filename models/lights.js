const mongoose = require('mongoose');
const lightsSchema = mongoose.Schema({
    uuid:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    status:{
        type: String,
        default: "ON"
    }
});

const Light = module.exports = mongoose.model('lights', lightsSchema);

module.exports.addLight = (light, callback) => {
    console.log("Light is :"+light);
    Light.create(light, callback);
}