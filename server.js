var express = require("express");
var app = express();
var router = express.Router();
var session = require('express-session');
var plotly = require('plotly')("anagha_ramane", "ZUKNUSXKoy75LQP47cCW")
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: "e5ad6980",
  apiSecret: "308d219cff4e6284"
});

const Light = require(__dirname + '/models/lights');
const Doctor = require(__dirname + '/models/doctor');
const Patient = require(__dirname + '/models/patient');
const ECG = require(__dirname + '/models/ecg');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'anagha', cookie:{maxAge: 86400000}}));



var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/iotServer');
var db=mongoose.connections;

var path = __dirname + '/views/';

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

router.get("/doctors/:_id/register_patient",function(req,res){
	console.log("comming here.............")
	console.log(req.params["_id"])
  res.render(path + "register_patient.jade", {doctor_id: req.params["_id"]});
});

router.get("/doctors/:_id/remove_patient",function(req,res){
	console.log("comming here.............")
	console.log(req.params["_id"])
  res.render(path + "delete_patient.jade", {doctor_id: req.params["_id"]});
});

router.get("/patients",function(req,res){
	console.log("In redirection...")
	console.log(req.session.doctor_id)
	Patient.find({doctor_id:req.session.doctor_id},function(err,patients){
		if(err){
			console.log("some error while redirecting...")
		}else{
			res.render(path + "patients.jade", {patients: patients,doctor_id: req.session.doctor_id});
		}
	})  
});

router.get("/patients/:_id/view_ecg_data",function(req,res){
	console.log("In view ecg data...")
	console.log(req.session.doctor_id)
	ECG.find({patient_id:req.params["_id"]},function(err,ecgs){
		if(err){
			console.log("some error while redirecting...")
		}else{
			req.session.doctor_id = req.session.doctor_id
			res.render(path + "ecg.jade", {ecgs: ecgs,doctor_id: req.session.doctor_id});
		}
	})  
});



router.post("/register",function(req,res){  // REGISTER ROUTE
	//console.log("Comming hereeeee..... in addDoctor route.");
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
		    	Patient.find({doctor_id: doctor._id},function(err,patients){
						if(err){
							console.log("Some error occurred....")
						}else{
							res.render(path + "patients.jade", {patients: patients, doctor_id: doctor._id})
						}
					})		    	
		    }
			});
		}
	})	
});



// //////////////////////////////////////////////////////////////////

router.post("/patients",function(req,res){  // LOGIN ROUTE
	//console.log("Comming hereeeee..... in addDoctor route.");
	// var new_doctor = req.body;
	var email = req.body.email
	// var doc = Doctor.findOne({email: email}
	Doctor.findOne({email: email},function(err,doctor){
		console.log("in find one in patients")
		console.log("doctor is "+doctor)
		if (doctor !== null){
			if(doctor.password == req.body.password){
				console.log("Success!!!....Redirecting........")	
				// var patients = []	
				Patient.find({ doctor_id: doctor._id }, function (err, patients) {
					console.log(patients)
				  if(err){
				  	console.log("Some error...")
				  }else{	
				  	req.session.doctor_id = doctor._id			  	
				  	res.render(path + 'patients.jade', {patients: patients,doctor_id: doctor._id})
				  }
				});		
				// var patients = []
				// var patients = Patient.find({_id: doctor._id})
				// console.log("*******************")
				// console.log(patients);
				// console.log("*******************")
				
			}else{
				console.log("Invalid Email or Password")
			}			
		}else{			
			console.log("Doctor with this email id is not registered")
			// res.json({
   //      success:false,
   //      msg:"Doctor with this email id is not registered",
   //      doctor:doctor
   //    });
		}
	})
	// res.sendFile(path + "patients.html");
});


/////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////

router.post("/registerpatient",function(req,res){

//console.log("Comming hereeeeee in patient vala method")
var new_patient=req.body;
// var patient_id=req.params["_id"]
// console.log(req.body.doctor_id)
Doctor.findOne({"_id": req.body.doctor_id}, function(err,doctor){
	// console.log("*********************")
	// console.log(doctor)
	// console.log("*********************")
	if(err){
		console.log(err)
	}else{
		Patient.addPatient(new_patient,(err,patient)=>{
			if(err){
				console.log("Something is wrong")
			}else{
				Patient.find({doctor_id: doctor._id},function(err,patients){
					if(err){
						console.log("Some error occurred....")
					}else{
						res.render(path + "patients.jade", {patients: patients, doctor_id: doctor._id})
					}
				})
				
			}
		})
	}
})

				
});



/////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////



router.get('/patients/:_id/remove_patient', (req, res, next) => {           
    console.log("comming hereeeeee in remove patient")
		var patient_id=req.params["_id"]
	// console.log(req.body.doctor_id)
	Patient.findOne({"_id": patient_id}, function(err,patient){
	// console.log("*********************")
	console.log(patient)
	
	// console.log("*********************")
	if(err){
		console.log(err)
	}else{
		var doctor_id = patient.doctor_id;
    Patient.remove(patient,(err,patient)=>{
			if(err){
				console.log("Something is wrong")
			}else{
				Patient.find({doctor_id: doctor_id},function(err,patients){
					if(err){
						console.log("Some error occurred....")
					}else{
						res.render(path + "patients.jade", {patients: patients, doctor_id: doctor_id})
					}
				})
				
			}
		})
	}
})

				
});

///////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////

router.get('/patients/:_id/remove_patient', (req, res, next) => {           
  console.log("comming hereeeeee in remove patient")
	var patient_id=req.params["_id"]
	// console.log(req.body.doctor_id)
	Patient.findOne({"_id": patient_id}, function(err,patient){
	// console.log("*********************")
	console.log(patient)
	var doctor_id = patient.doctor_id;
	// console.log("*********************")
	if(err){
		console.log(err)
	}else{
    Patient.remove(patient,(err,patient)=>{
			if(err){
				console.log("Something is wrong")
			}else{
				Patient.find({doctor_id: doctor_id},function(err,patients){
					if(err){
						console.log("Some error occurred....")
					}else{
						res.render(path + "patients.jade", {patients: patients, doctor_id: doctor_id})
					}
				})
				
			}
		})
	}
})

				
});

router.get('/patients/:_id/edit', (req, res, next) => {  
	console.log("comming hereeeeee in edit patient")	
	var patient_id = req.params["_id"]
	Patient.findOne({"_id": patient_id}, function(err,patient){
		if(err){
			console.log("Some error in edit")
		}else{
			var doctor_id = patient.doctor_id
			req.session.doctor_id = doctor_id
			console.log("888 "+req.session.doctor_id)
			res.render(path + "edit.jade", {patient: patient})
		}
	});  
});

router.get('/patients/:_id/ecg_view', (req, res, next) => {  
	console.log("comming hereeeeee in ecg_view for patient")	
	var patient_id = req.params["_id"]
	// Patient.findOne({"_id": patient_id}, function(err,patient){
	// 	if(err){
	// 		console.log("Some error in edit")
	// 	}else{
	// 		var doctor_id = patient.doctor_id
	// 		req.session.doctor_id = doctor_id
	// 		console.log("888 "+req.session.doctor_id)
	// 		res.render(path + "edit.jade", {patient: patient})
	res.sendFile(path + "ecg_view.html");
	// 	}
	// });  
});

router.post("/patients/update",function(req,res){  // UPDATE ROUTE
	console.log("Comming hereeeee..... in update patient route.");
	var patient = req.body;	
	console.log("Edittttttttttttttttttiiiiiiiiinggggg")
	console.log(patient)
	console.log("Edittttttttttttttttttiiiiiiiiinggggg")

	Patient.findOneAndUpdate({_id: patient.patient_id}, {$set:req.body}, {new: true}, function(err, patient){
		console.log("in find one and update")
		console.log("Patient is "+patient)
	  if(err){
	      console.log("Something wrong when updating data!");
	  }else{
	  	Patient.find({doctor_id: patient.doctor_id},function(err,patients){
			if(err){
				console.log("Some error occurred....")
			}else{
				res.render(path + "patients.jade", {patients: patients, doctor_id: patient.doctor_id})
			}
		})
	  }	  
	});
	// var doc = Doctor.findOne({email: email}
	// Device.findOneAndUpdate(query,update,options,callback);
	
});

//   trace1 = {
//  		name: 'Col1', 
//   	type: 'scatter'
// 	}
// 	data = [trace1];
//   // var layout = {fileopt : "overwrite", filename : "simple-node-example"};

//   layout = {
//   autosize: true, 
//   height: 365, 
//   legend: {
//     x: 1.02, 
//     y: 1, 
//     bgcolor: '#fff', 
//     bordercolor: '#444', 
//     borderwidth: 0, 
//     font: {
//       color: '', 
//       family: '', 
//       size: 0
//     }, 
//     traceorder: 'normal', 
//     xanchor: 'left', 
//     yanchor: 'top'
//   }, 
//   title: 'Test ECG', 
//   titlefont: {
//     color: '', 
//     family: '', 
//     size: 0
//   }, 
//   width: 1214, 
//   xaxis: {
//     anchor: 'y', 
//     autorange: false, 
//     autotick: true, 
//     domain: [0, 1], 
//     dtick: 500, 
//     exponentformat: 'B', 
//     gridcolor: '#eee', 
//     gridwidth: 1, 
//     linecolor: '#444', 
//     linewidth: 1, 
//     mirror: false, 
//     nticks: 0, 
//     overlaying: false, 
//     position: 0, 
//     range: [3286.71778517, 5749.33229087], 
//     rangemode: 'normal', 
//     showexponent: 'all', 
//     showgrid: true, 
//     showline: false, 
//     showticklabels: true, 
//     tick0: 0, 
//     tickangle: 'auto', 
//     tickcolor: '#444', 
//     tickfont: {
//       color: '', 
//       family: '', 
//       size: 0
//     }, 
//     ticklen: 5, 
//     ticks: '', 
//     tickwidth: 1, 
//     title: '0...20000', 
//     titlefont: {
//       color: '', 
//       family: '', 
//       size: 0
//     }, 
//     type: 'linear', 
//     zeroline: true, 
//     zerolinecolor: '#444', 
//     zerolinewidth: 1
//   }, 
//   yaxis: {
//     anchor: 'x', 
//     autorange: false, 
//     autotick: true, 
//     domain: [0, 1], 
//     dtick: 200, 
//     exponentformat: 'B', 
//     gridcolor: '#eee', 
//     gridwidth: 1, 
//     linecolor: '#444', 
//     linewidth: 1, 
//     mirror: false, 
//     nticks: 0, 
//     overlaying: false, 
//     position: 0, 
//     range: [1635.88095238, 2589.65079365], 
//     rangemode: 'normal', 
//     showexponent: 'all', 
//     showgrid: true, 
//     showline: false, 
//     showticklabels: true, 
//     tick0: 0, 
//     tickangle: 'auto', 
//     tickcolor: '#444', 
//     tickfont: {
//       color: '', 
//       family: '', 
//       size: 0
//     }, 
//     ticklen: 5, 
//     ticks: '', 
//     tickwidth: 1, 
//     title: 'Click to enter Y axis title', 
//     titlefont: {
//       color: '', 
//       family: '', 
//       size: 0
//     }, 
//     type: 'linear', 
//     zeroline: true, 
//     zerolinecolor: '#444', 
//     zerolinewidth: 1
//   }
// };

// var c = 1
// x = []
// y = []
// while(1){
// 	if(c < 10){
// 		var m = Math.floor((Math.random() * 10000) + 1);
// 		x.push(m)
// 		var n = Math.floor((Math.random() * 10000) + 1);
// 		y.push(n)
// 		c += 1
// 		console.log("data generated---count--- "+n)
// 	}else{
// 		break
// 	}	
// }

// var ecgdata = 
// 	{ "patient_id": "5a6c3b3111e70517648e8155",    
//     "x": trace1["x"],
//     "y": trace1["y"] 
//   }

// var data = [{x:ecgdata.x, y:ecgdata.y, type: 'scatter'}];
// var layout = {fileopt : "overwrite", filename : "simple-node-example"};

router.post("/sendECGData",function(req,res){
	console.log("Comming hereeeee!!!!")
	console.log(req.body)
	console.log("**********************************")
	ECG.addecg(req.body,(err,ecg)=>{
		if(err){
			console.log(err)
			res.json({
      	success:false,
      	message: "Error while inserting ecg data"      	
      })
		}else{
			console.log("ECG data added")
			Patient.findOne({_id:ecg.patient_id},function(err,patient){
				if(err){
					console.log("Error finding patient")
				}else{
					req.session.doctor_id = patient.doctor_id
					nexmo.message.sendSms(
				    "918888186174", patient.emergency_contact_number, "Sir tumcha patient zata ki kay...bagha zara tyachyakade...", {type: 'unicode'},
				    (err, responseData) => {if (responseData) {console.log(responseData)}}
				  );
				}
			})
			
			// Patient.findOneAndUpdate({_id: req.body.patient_id}, {$set:{plotly_url: req.body.url}}, {new: true}, function(err, patient){
			// 	console.log("in find one and update")
			// 	console.log("Patient is "+patient)
			//   if(err){
			//       console.log("Something wrong when updating patient!");
			//       res.json({
			//       	success:true,
			//       	message: "Error while updating patient for plotly url",
			//       	patient: patient
			//       })
			//   }else{
			//   	console.log("ECG data added and patient updated with plotly url")
			//   	res.json({
		 //      	success:false,
		 //      	message: "Successfully updated patient for plotly url",
		 //      	patient: patient
		 //      })
			//   }
			// })	
			res.json({
      	success:true,
      	message: "Successfully added ecg data for patient",
      	ecg: ecg
      })

		}
	})
	
});

























////////////////////////////////////////////////////////////////////////////
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



