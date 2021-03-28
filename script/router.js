const express = require("express");
const router = express.Router()
const logger = require("./logger.js")
const clientAddress = require("./getclientaddress.js")
const adminIp = "149.200.98.57"
const path = require('path')

router.use(express.static(path.resolve("test_page/")));
router.use(function (req, res, next) {
    if (req.secure) next();
    else {
        logger.myLogger(req, "Insecure HTTP accessed - Redirecting", res.statusCode)
        res.status(200)
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
});

router.get("/getlogfile", (req, res) => {
    if (clientAddress.getClientAddress(req) == adminIp) {
        res.status(200)
        logger.myLogger(req, "Log File sent to user.", res.statusCode)
        res.sendFile(path.resolve("log/server_log_2021-Mar.txt"))
    }
    else {
        res.redirect(`https://${req.headers.host}/underconstruction`)
    }
})

router.get("/main", (req, res) => {
    if (clientAddress.getClientAddress(req) == adminIp) {
        res.status(200)
        logger.myLogger(req, "Main accessed by admin.", res.statusCode)
        res.sendFile(path.resolve("test_page/mainpage.html"))
    }
    else {
        res.redirect(`https://${req.headers.host}/underconstruction`)
    }
})

router.get("/underconstruction", (req, res) => {
    res.status(200)
    logger.myLogger(req, "Under construction page served.")
    res.sendFile(path.resolve("test_page/underconstruction.html"))
})

router.get("*", (req, res) => {
    res.redirect(`https://${req.headers.host}/main`);
}
);
module.exports = router;