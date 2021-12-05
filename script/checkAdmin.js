

let checkAdmin = (req, res, next) => {
    if (req.session.adminaccess) {

        next();
    }
    else {
        res.status(401).json({
            "status" : "error",
            "errormessage" : "Nincs rendszergazda jogosultsága a tartalom megtekintéséhez.",
            "header" : "Admin auth hiba"
        })
    }
}

module.exports = checkAdmin