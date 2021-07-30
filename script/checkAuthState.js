const myLogger = require('./logger.js')

let checkAuthState = (req, res, next) => {
    if (req.session.authenticated) {
        myLogger("User authentication check passed", req, res.statusCode)
        next();
    }
    else {
        res.redirect("/")

    }
}

module.exports = checkAuthState