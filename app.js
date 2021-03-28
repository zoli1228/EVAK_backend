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
const clientAddress = require("./script/getclientaddress.js")

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




/* app.get("/", (req, res) => {

  logger.myLogger(req, "Home page accessed", res.statusCode)
  res.sendFile(__dirname + "/test_page/mainpage.html");
});
 */

// Invalid route 404 page //
app.get("*", (req, res) => {
  if(clientAddress.getClientAddress(req) == "149.200.98.57") {
    
    logger.myLogger(req, "Admin access", res.statusCode)
    res.status(200)
    res.sendFile(__dirname + "/test_page/mainpage.html");

  } else {
    logger.myLogger(req, "Foreign access - Displaying Under Construction", res.statusCode)
    res.status(200)
    res.sendFile(__dirname + "/test_page/underconstruction.html")
  }
});


  



logger.myLogger(0,`Server started on ports HTTP ${httpPort} and HTTPS ${httpsPort}`)