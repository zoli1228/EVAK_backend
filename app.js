const express = require("express");
const app = express();
const httpsPort = 443
const httpPort = 80
const http = require("http")
const https = require("https")
const mongoose = require("mongoose")
const logger = require("./script/logger.js")
const fs = require("fs")
const rs = require("./script/router")

let sslOptions = {
  key: fs.readFileSync('./cert/private.key'),
  cert: fs.readFileSync('./cert/certificate.crt')
};
app.use(rs)
http.createServer(app).listen(httpPort)
https.createServer(sslOptions, app).listen(httpsPort);
app.use(express.static(__dirname + "/test_page/"));
logger.myLogger(0, `Server started on ports HTTP ${httpPort} and HTTPS ${httpsPort}`)
