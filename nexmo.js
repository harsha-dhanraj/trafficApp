const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = app.listen(3000);


const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: "e5ad6980",
  apiSecret: "308d219cff4e6284"
});


app.post('/send', (req, res) => {
  // Send SMS
  nexmo.message.sendSms(
    "918888186174", req.body.toNumber, req.body.message, {type: 'unicode'},
    (err, responseData) => {if (responseData) {console.log(responseData)}}
  );
});


