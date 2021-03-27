const express = require("express");
const app = express();
const httpsPort = 443
const httpPort = 80
const http = require("http")
const https = require("https")
const fs = require("fs")
const mongoose = require("mongoose")
const ts = require("./script/timestamp.js");
const logger = require("./script/logger.js")







var sslOptions = {
  key: fs.readFileSync('./cert/private.key'),
  cert: fs.readFileSync('./cert/certificate.crt')
};

http.createServer(app).listen(httpPort)
https.createServer(sslOptions, app).listen(httpsPort);




app.use(function (req, res, next) {
  if (req.secure) {
   // logger.myLogger(req, "Accessed HTTPS", res.statusCode)
    next();
  } else {
    
    logger.myLogger(req, "Insecure HTTP accessed - Redirecting", res.statusCode)
    res.redirect('https://' + req.headers.host + req.url);
  }
});

app.use(express.static(__dirname + "/test_page/"));



app.get("/", (req, res) => {
  logger.myLogger(req, "Home page accessed", res.statusCode)
  res.sendFile(__dirname + "/test_page/mainpage.html");
});

app.get("/panty", (req, res) => {
  logger.myLogger(req, "Panty page accessed", res.statusCode)
  res.send("You naughty naughty");
});


// Invalid route 404 page //
app.get("*", (req, res) => {
  res.status(404)
  logger.myLogger(req, "Tried to access invalid route - 404 page sent", res.statusCode)
  res.sendFile(__dirname + "/test_page/404.html");
});

/* let myLogger = (req, message, status) => {
  if(req == 0 && !status) {
    log(`----${ts.timestamp()}---${message}----`)
    return;
  } 


  
  
  let address = clientAddress.getClientAddress(req)
  
  let logLines = [
    `--------------[ ${logId} ]------------------`,
    "Timestamp:  " + ts.timestamp(),
    "Address:    " + address,
    "Event:      " + message,
    "Status:     " + status,
    "\r\n "
  ]

  for(let i = 0; i < logLines.length; i++)
  {
    log(logLines[i])
  }

  logId++
} */



logger.myLogger(0,`Server started on ports HTTP ${httpPort} and HTTPS ${httpsPort}`)