const express = require("express");
const app = express();
const httpApp = express();

const httpsPort = 443 
const httpPort = 80
const http = require("http")
const https = require("https")
const mongoose = require("mongoose")
const logger = require("./script/logger.js")
const fs = require("fs")
const router = require("./script/router")
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'fd532d1539d094c47681dd6db74242d26a02af39132f3f7ea470507321eb847e',
  baseURL: 'https://www.evak.hu',
  clientID: 'candBOVoGBHTJ9UWJlUTarKtNXD9kKU2',
  issuerBaseURL: 'https://evak.eu.auth0.com'
};

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

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

