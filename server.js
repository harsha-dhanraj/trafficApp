var express = require("express");
var app = express();
var router = express.Router();
const Light = require(__dirname + '/models/lights');
const Doctor = require(__dirname + '/models/doctor');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/iotServer');
var db=mongoose.connections;

var path = __dirname + '/views/';

var threshold = 20;

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "home.html");
});

router.get("/login",function(req,res){
  res.sendFile(path + "home.html");
});

router.get("/register",function(req,res){
  res.sendFile(path + "register.html");
});


router.post("/register",function(req,res){
	console.log("Comming hereeeee..... in addDoctor route.");
	var new_doctor = req.body;
	var email = new_doctor.email
	// var doc = Doctor.findOne({email: email}
	Doctor.findOne({email: email},function(err,doctor){

		console.log("in find one")
		console.log("doctor is "+doctor)
		if (doctor !== null){
			res.json({
        success:false,
        msg:"Doctor with this email id is already registered",
        doctor:doctor
      });
		}else{
			Doctor.addDoctor(new_doctor,(err,doctor)=>{
		    // console.log(new_doctor);
		    if (err){
	        console.error(err);
	        res.json({
            success: false,
            msg: "There is some error"
	        });
		    } else {
		    	res.sendFile(path + "patients.html");
	        // res.json({
         //    success:true,
         //    msg:"Doctor registered successfully....",
         //    doctor:doctor
	        // })
		    }
			});
		}
	})
	// res.sendFile(path + "patients.html");
});

// //////////////////////////////////////////////////////////////////

router.post("/addLight",function(req,res){ 
	console.log("Comming hereeeee......") 
  var new_light = req.body;
  var uuid=new_light.uuid
  var distance = new_light.distance
  console.log("new light req:"+uuid)
  // findOne({_id: req.params["_id"]}
  Light.findOne({uuid: uuid},function(err,new_light){
  // Light.findOne({},(err,new_light_)=>{
    if (new_light.length != 0){
    		if(distance <= threshold){
    			new_light.status = "ON"
    		}else{
    			new_light.status = "OFF"
    		}
    		new_light.save();
        res.json({
          success:false,
          msg:"light already registered",
          light:new_light
        });
    }else{
		  Light.addLight(new_light,(err,light)=>{
		    console.log(new_light);
		    if (err){
	        console.error(err);
	        res.json({
            success: false,
            msg: "There is some error"
	        });
		    } else {
	        res.json({
            success:true,
            msg:"Light registered successfully....",
            light:light
	        })
		    }
			});
		}
});
});


/////////////////////////////////////////////////////////////////////



router.get("/lights",function(req,res){
  // res.sendFile(path + "lights.html");
  Light.find({},function(err,lights){
		
	if(err){
		console.log(err);
	}

	else{

		res.render(path+'lights.jade', { lights: lights });
		// res.sendFile(path + "lights.html", { lights: lights });
		}
});

});

router.get("/changeLightStatus/:_id",function(req,res){
	console.log("Comming hereeeeee in change status method")
	console.log(req.params["_id"])

  // res.sendFile(path + "lights.html");
  Light.findOne({_id: req.params["_id"]},function(err,light){
  	console.log("**********************")
		console.log(light)
		if (light.status == "ON"){
			light.status = "OFF"
		}else{
			light.status = "ON"
		}
		light.save()
		console.log("**********************")
	// if(err){
	// 	console.log(err);
	// }

	// else{

		res.render(path+'lights.jade', { lights: [light] });		
		// }
});

});

router.post("/addLight",function(req,res){ 
	console.log("Comming hereeeee......") 
  var new_light = req.body;
  var uuid=new_light.uuid
  var distance = new_light.distance
  console.log("new light req:"+uuid)
  // findOne({_id: req.params["_id"]}
  Light.findOne({uuid: uuid},function(err,new_light){
  // Light.findOne({},(err,new_light_)=>{
    if (new_light.length != 0){
    		if(distance <= threshold){
    			new_light.status = "ON"
    		}else{
    			new_light.status = "OFF"
    		}
    		new_light.save();
        res.json({
          success:false,
          msg:"light already registered",
          light:new_light
        });
    }else{
		  Light.addLight(new_light,(err,light)=>{
		    console.log(new_light);
		    if (err){
	        console.error(err);
	        res.json({
            success: false,
            msg: "There is some error"
	        });
		    } else {
	        res.json({
            success:true,
            msg:"Light registered successfully....",
            light:light
	        })
		    }
			});
		}
});
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});



