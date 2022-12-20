//jshint esversion: 6

const express = require("express");
const https = require('https');
require('dotenv').config();

const app = express();

app.use(express.static("Public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res) {

  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/f1125d422f?skip_merge_validation=false&skip_duplicate_check=false";

  const options = {
    method: "POST",
    auth: process.env.API_KEY
  }

  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function()  {
  console.log("Server is running on Port: 3000.");
});

