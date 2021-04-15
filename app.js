const express = require("express");
const app = express();
const httpApp = express();
const path = require('path')
const httpsPort = 443 
const httpPort = 80
const http = require("http")
const https = require("https")
const logger = require("./script/logger.js")
const fs = require("fs")
const router = require("./script/router")



app.use(express.static(path.resolve("..", "EVAK-0.0.1", "public")));
app.use(express.static(path.resolve("..", "EVAK-0.0.1", "themes")));
app.use(express.static(path.resolve("..", "EVAK-0.0.1", "script")));



let sslOptions = {
  key: fs.readFileSync('./cert/private.key'),
  cert: fs.readFileSync('./cert/certificate.crt')
};



http.createServer(httpApp).listen(httpPort)
logger.myLogger(0, `HTTP Server started on port ${httpPort} `)
https.createServer(sslOptions, app).listen(httpsPort);
logger.myLogger(0, `HTTPS Server started on port ${httpsPort} `)

httpApp.get("*", function (req, res, next) {
  res.redirect(`https://${req.headers.host}${req.url}`);
});


app.use(router)

