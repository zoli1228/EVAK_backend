

const express = require("express");
const app = express();
const httpApp = express();
const path = require('path')
const httpsPort = 12000
const httpPort = 11000
const http = require("http")
const https = require("https")
const myLogger = require('./script/logger.js') // (Message, req, status) (if !req && !status) {message with timestamp}
const fs = require("fs")
const router = require("./script/router")

app.use(express.static(path.resolve("cert", "challenge")));
app.use(express.static(path.resolve("..", "EVAK-0.0.1", "public")));
app.use(express.static(path.resolve("..", "EVAK-0.0.1", "themes")));
app.use(express.static(path.resolve("..", "EVAK-0.0.1", "script")));
app.use(express.static(path.resolve("..", "EVAK-0.0.1", "pages", "modules")));
app.use(express.static(path.resolve("node_modules", "bootstrap")));

let cert = fs.readFileSync('./cert/fullchain.pem')
let key = fs.readFileSync('./cert/evak.hu.key')

let sslOptions = {
  cert: cert,
  key: key

};

http.createServer(httpApp).listen(httpPort)
myLogger(`HTTP Server started on port ${httpPort}`)
https.createServer(sslOptions, app).listen(httpsPort)
myLogger(`HTTPS Server started on port ${httpsPort}`)

httpApp.get("*", function (req, res, next) {
  res.redirect(`https://${req.headers.host}${req.url}`);
});

app.get("/adminservermenu", function (req, res) {
  res.sendFile(path.resolve('admin.html'))
})
/* httpApp.get("/.well-known/acme-challenge/9UWf_941mYJS_e6WXlMTYDX_FCBgjUdvPzp218B_ef0", (req, res) => {
  let myPath = path.resolve("cert", "challenge", ".well-known", "acme-challenge", "9UWf_941mYJS_e6WXlMTYDX_FCBgjUdvPzp218B_ef0")
  let result = fs.readFileSync(myPath)
  res.send(result)
})
httpApp.get("/.well-known/acme-challenge/kz8BAN-bRvcJ-zSoHLB2vfl0B3QaK7_GgxAfIJ2NENk", (req, res) => {
  let mypath = path.resolve("cert", "challenge", ".well-known", "acme-challenge", "kz8BAN-bRvcJ-zSoHLB2vfl0B3QaK7_GgxAfIJ2NENk")
  let result = fs.readFileSync(mypath)
  res.send(result)
})
 */

app.use(router)
const cors = require("cors")
app.use(cors())