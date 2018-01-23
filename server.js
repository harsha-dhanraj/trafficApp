var express = require("express");
var app = express();
var router = express.Router();
const Light = require(__dirname + '/models/lights');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  console.log("new light req:"+req)
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
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});


