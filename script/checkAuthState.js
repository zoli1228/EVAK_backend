let log = require("./logger")

let checkAuthState = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    }
    else {
        log("Védett tartalomhoz való jogosulatlan hozzáférési próbálkozás", req, 401)
        res.status(401).redirect("/")
    }
}

module.exports = checkAuthState