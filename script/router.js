const express = require("express");
const router = express.Router()
const logger = require("./logger.js")
const clientAddress = require("./getclientaddress.js")
const adminIp = "149.200.109.0"
const path = require('path')




router.use(express.static(path.resolve("../EVAK-0.0.1/public/")));
router.use(function (req, res, next) {
    if (req.secure) { next() }
    else {
        logger.myLogger(req, "Insecure HTTP accessed - Redirecting", res.statusCode)
        res.send(alert("Redirected to secure site."))

        res.redirect(`https://${req.headers.host}${req.url}`);
        
    }
});



router.get("/getlogfile", (req, res) => {
    if (clientAddress.getClientAddress(req) == adminIp) {

        logger.myLogger(req, "Log File sent to user.", res.statusCode)
        res.status(200).sendFile(path.resolve("log/server_log_2021-Mar.txt"))
    }
    else {

        res.redirect(`https://${req.headers.host}/underconstruction`)
    }
})

router.get("/", (req, res) => {
    if (clientAddress.getClientAddress(req) == adminIp) {

        logger.myLogger(req, "Main accessed by admin.", res.statusCode)
        res.status(200).sendFile(path.resolve("../EVAK-0.0.1/home.html"))
    }
    else {
        res.redirect(`https://${req.headers.host}/underconstruction`)
    }
})

router.get("/underconstruction", (req, res) => {

    logger.myLogger(req, "Under construction page served.")

    res.status(200).sendFile(path.resolve("../EVAK-0.0.1/public/underconstruction.html"))

})


router.use(function (req, res) {
    res.status(404).sendFile(path.resolve("../EVAK-0.0.1/public/404.html"));
});
// Handle 500
router.use(function (error, req, res, next) {
    res.status(500).send('500: Internal Server Error');
});
module.exports = router;