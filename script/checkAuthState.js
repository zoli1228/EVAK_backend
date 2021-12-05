

let checkAuthState = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    }
    else {
        res.status(401).json({
            "status" : "error",
            "errormessage" : "Nincs jogosultsága a tartalom megtekintéséhez.",
            "header" : "Auth hiba"
        })
    }
}

module.exports = checkAuthState