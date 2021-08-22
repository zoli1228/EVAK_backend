const express = require("express");
const app = express();
const httpApp = express();
const path = require('path')
const httpsPort = 80
const httpPort = 443
const http = require("http")
const https = require("https")
const myLogger = require('./script/logger.js') // (Message, req, status) (if !req && !status) {message with timestamp}
const fs = require("fs")
const router = require("./script/router")
const cors = require("cors")


app.use(express.static(path.resolve("..", "EVAK-0.0.1", "public")));
app.use(express.static(path.resolve("..", "EVAK-0.0.1", "themes")));
app.use(express.static(path.resolve("..", "EVAK-0.0.1", "script")));
app.use(express.static(path.resolve("..", "EVAK-0.0.1", "pages", "modules")));
app.use(cors())


let sslOptions = {
  key: fs.readFileSync('./cert/private.key'),
  cert: fs.readFileSync('./cert/certificate.crt')
};



try {
  http.createServer(httpApp).listen(httpPort)
  myLogger(`HTTP Server started on port ${httpPort}`)
  https.createServer(sslOptions, app).listen(httpsPort);
  myLogger(`HTTPS Server started on port ${httpsPort}`);
} catch(err) {
  return myLogger("Hiba a szerver indítása során.")
}

httpApp.get("*", function (req, res, next) {
  res.redirect(`https://${req.headers.host}${req.url}`);
});


app.use(router)

