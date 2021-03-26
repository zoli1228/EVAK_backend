const express = require("express");
const app = express();
const httpsPort = 443
const httpPort = 80
const http = require("http")
const https = require("https")
const fs = require("fs")
const mongoose = require("mongoose")

let logId = 0

var timestamp = () => {
  var date = new Date();
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getFullYear()}.${months[date.getMonth()]}.${date.getDate()} - ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}`

}



var sslOptions = {
  key: fs.readFileSync('./cert/private.key'),
  cert: fs.readFileSync('./cert/certificate.crt')
};

http.createServer(app).listen(httpPort)




https.createServer(sslOptions, app).listen(httpsPort);



app.use(function (req, res, next) {
  if (req.secure) {
    myLogger(req, "Accessed HTTPS", res.statusCode)
    next();
  } else {
    
    myLogger(req, "Insecure HTTP accessed - Redirecting", res.statusCode)
    res.redirect('https://' + req.headers.host + req.url);
  }
});

getClientAddress = function (req) {
  return req.ip.split(":").pop();
};
/* app.listen( port, () => {
  console.log("Application started and Listening on port " + port);
}); */

app.use(express.static(__dirname + "/test_page/"));



app.get("/", (req, res) => {
  myLogger(req, "Home page accessed", res.statusCode)
  res.sendFile(__dirname + "/test_page/index.html");
});

app.get("/panty", (req, res) => {
  myLogger(req, "Panty page accessed", res.statusCode)
  res.send("You naughty naughty");
});


// Invalid route 404 page //
app.get("*", (req, res) => {
  res.status(404)
  myLogger(req, "Tried to access invalid route - 404 page sent", res.statusCode)
  res.sendFile(__dirname + "/test_page/404.html");
});

let myLogger = (req, message, status) => {
  let address = getClientAddress(req)
  console.log("×-×-×-×-×-×-×-×-×")
  console.log("Log ID:     " + logId)
  console.log("Timestamp:  " + timestamp())
  console.log("Address:    " + address)
  console.log("Event:      " + message)
  console.log("Status:     " + status)
  console.log(" ")
  logId++
}