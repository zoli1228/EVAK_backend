

let checkAdmin = (req, res, next) => {
    if (req.session.adminaccess) {

        next();
    }
    else {
        res.sendStatus(401)
    }
}

module.exports = checkAdmin