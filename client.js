const request =require('request');

var sendStatus = setInterval(function () {
      console.log("sending co-ordinates.......");
      var n = Math.floor((Math.random() * 100) + 1);
      
      var payload={
        uuid:"1000",
        area:"Pune",
        status: "OFF",
        distance: n
      }
      var connOpt={
        url:"http://localhost:3000/addLight",
        method:'POST',
        headers:{
          'content-Type':'application/json'
        },
        json:payload
      }    

      request(connOpt,(err,res,body)=>{
        if(body.success){
          console.log(body)
          // console.log("Light is registered successfully");
          console.log(body.light);
        }else {
          console.log(body.msg);  
        } 
      });
  }, 10000);