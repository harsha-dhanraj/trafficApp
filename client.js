const request =require('request');
// var express = require("express");
var plotly = require('plotly')("tanaya_ramane", "YY8u8SRyHK07fUqJbs4R")
var sleep = require('sleep')
// var app = express();
// app.listen(3031,function(){
//   console.log("Live at Port 3031");
// });
layout = {
  autosize: true, 
  height: 365, 
  legend: {
    x: 1.02, 
    y: 1, 
    bgcolor: '#fff', 
    bordercolor: '#444', 
    borderwidth: 0, 
    font: {
      color: '', 
      family: '', 
      size: 0
    }, 
    traceorder: 'normal', 
    xanchor: 'left', 
    yanchor: 'top'
  }, 
  title: 'Test ECG', 
  titlefont: {
    color: '', 
    family: '', 
    size: 0
  }, 
  width: 1214, 
  xaxis: {
    anchor: 'y', 
    autorange: true, 
    autotick: true, 
    domain: [0, 1], 
    dtick: 10, 
    exponentformat: 'B', 
    gridcolor: '#eee', 
    gridwidth: 1, 
    linecolor: '#444', 
    linewidth: 1, 
    mirror: false, 
    nticks: 0, 
    overlaying: false, 
    position: 0, 
    range: [3286.71778517, 5749.33229087], 
    rangemode: 'normal', 
    showexponent: 'all', 
    showgrid: true, 
    showline: false, 
    showticklabels: true, 
    tick0: 0, 
    tickangle: 'auto', 
    tickcolor: '#444', 
    tickfont: {
      color: '', 
      family: '', 
      size: 0
    }, 
    ticklen: 5, 
    ticks: '', 
    tickwidth: 1, 
    title: '0...20000', 
    titlefont: {
      color: '', 
      family: '', 
      size: 0
    }, 
    type: 'linear', 
    zeroline: true, 
    zerolinecolor: '#444', 
    zerolinewidth: 1
  }, 
  yaxis: {
    anchor: 'x', 
    autorange: true, 
    autotick: true, 
    domain: [0, 1], 
    dtick: 200, 
    exponentformat: 'B', 
    gridcolor: '#eee', 
    gridwidth: 1, 
    linecolor: '#444', 
    linewidth: 1, 
    mirror: false, 
    nticks: 0, 
    overlaying: false, 
    position: 0, 
    range: [1635.88095238, 2589.65079365], 
    rangemode: 'normal', 
    showexponent: 'all', 
    showgrid: true, 
    showline: false, 
    showticklabels: true, 
    tick0: 0, 
    tickangle: 'auto', 
    tickcolor: '#444', 
    tickfont: {
      color: '', 
      family: '', 
      size: 0
    }, 
    ticklen: 5, 
    ticks: '', 
    tickwidth: 1, 
    title: 'Click to enter Y axis title', 
    titlefont: {
      color: '', 
      family: '', 
      size: 0
    }, 
    type: 'linear', 
    zeroline: true, 
    zerolinecolor: '#444', 
    zerolinewidth: 1
  }
};

///////////////////////////////

(function loop() {
    var c = 0
    var a = 0
    var threshold = 2000
    var time = []
    var amplitude = []
    var last_amplitude = []
    var last_time = []
    while(1){
      if(a < threshold){    
        time.push(c)
        var a = Math.floor((Math.random() * 1018) + 1000);
        amplitude.push(a)
        c += 1
        console.log("Entry "+c+" ---"+"data generated---count--- "+a)
        sleep.sleep(1)
      }else{  
        break
      } 
    }
    console.log("threshold reached...")
    a = 0
    c = 0
    last_amplitude = amplitude
    last_time = time
    trace1 = {
      x: last_time,
      y: last_amplitude,
      name: 'Col1', 
      type: 'scatter'
    }
    data = [trace1];
    var url = ""
    plotly.plot(data, {layout: layout}, function (err, msg) {
      if (err){
        console.log(err);
      }else{
        console.log(msg)                
        var ecgdata = 
          { "patient_id": "5a6de293b2b00f4e30f9eb6f",    
            "x": trace1["x"],
            "y": trace1["y"],
            "plotly_url": msg.url
          }
        var connOpt={
          url:"http://localhost:3000/sendECGData",
          method:'POST',
          headers:{
            'content-Type':'application/json'
          },
          json:ecgdata
        }    

        request(connOpt,(err,res,body)=>{
          console.log("Comming hereeeeee.")
          if(body.success){
            console.log(body)        
            // console.log(body.message);
          }else {
            console.log(body.ecg);                        
          }
          loop() 
        });
      }
    })
}());


////////////////////////////////



// var c = 0
// var a = 0
// var threshold = 1900
// var time = []
// var amplitude = []
// var last_amplitude = []
// var last_time = []
// while(1){
//   if(a < threshold){    
//     time.push(c)
//     var a = Math.floor((Math.random() * 1018) + 1000);
//     amplitude.push(a)
//     c += 1
//     console.log("data generated---count--- "+a)
//     sleep.sleep(1)
//   }else{  
//     break
//   } 
// }
//     console.log("threshold reached...")
//     a = 0
//     c = 0
//     last_amplitude = amplitude.slice(Math.max(amplitude.length - 100, 1))
//     last_time = time.slice(Math.max(time.length - 100, 1))
//     trace1 = {
//       x: last_amplitude,
//       y: last_time,
//       name: 'Col1', 
//       type: 'scatter'
//     }
//     data = [trace1];
//     var url = ""
//     plotly.plot(data, {layout: layout}, function (err, msg) {
//       if (err){
//         console.log(err);
//       }else{
//         console.log(msg)        
//         console.log(msg);
//         var ecgdata = 
//           { "patient_id": "5a6de293b2b00f4e30f9eb6f",    
//             "x": trace1["x"],
//             "y": trace1["y"],
//             "url": msg
//           }
//         var connOpt={
//           url:"http://localhost:3000/sendECGData",
//           method:'POST',
//           headers:{
//             'content-Type':'application/json'
//           },
//           json:ecgdata
//         }    

//         request(connOpt,(err,res,body)=>{
//           if(body.success){
//             console.log(body)        
//             console.log(body.message);
//           }else {
//             console.log(body.ecg);  
//           } 
//         });
//       }
//     })
    

  

// var sendECG = setInterval(function () {
//       console.log("sending ecg data.......");
//       var n = Math.floor((Math.random() * 100) + 1);
      
//       var ecgdata = 
//         { "patient_id": "5a6c3b3111e70517648e8155",    
//           "x": trace1["x"],
//           "y": trace1["y"] 
//         }
//       var connOpt={
//         url:"http://localhost:3000/addLight",
//         method:'POST',
//         headers:{
//           'content-Type':'application/json'
//         },
//         json:payload
//       }    

//       request(connOpt,(err,res,body)=>{
//         if(body.success){
//           console.log(body)
//           // console.log("Light is registered successfully");
//           console.log(body.light);
//         }else {
//           console.log(body.msg);  
//         } 
//       });
//   }, 10000);