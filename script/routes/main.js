const router = require("express").Router()
const auth = require("../checkAuthState")
const pages = require("../pages")

router.get("/", auth, function (req, res) {
    if (req.session.user.pwReset) {
        res.redirect("/newpassword")
    }
    else {
        if (req.session.user) {
            if (req.session.user.isVerified) {
                res.sendFile(pages.main)
            } 
            else {
                res.json({
                    message: "Ez a fiók még nem lett hitelesítve."
                })
            }
        } else {
            res.redirect("/")
        }
    }
})

module.exports = router