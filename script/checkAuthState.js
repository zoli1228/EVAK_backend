

let checkAuthState = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    }
    else {
        res.sendStatus(401)
    }
}

module.exports = checkAuthState