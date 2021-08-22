const router = require("express").Router()
const auth = require("../checkAuthState")
const userModel = require("../userschema")
const bcrypt = require("bcrypt")
const myLogger = require("../logger")
const saltRounds = 10

router.route("/")
    .get(auth, function (req, res, next) {
        if (req.session) {
            if (req.session.user.pwReset) {
                res.sendFile(pages.changepassword)

            }
            else {
                res.redirect("/")
            }
        }
    })

    .post(auth, async function (req, res) {
        let { password, cpassword } = req.body
        if (validate.validatePassword(password, cpassword) != "OK") {
            res.json({
                status: "error",
                message: "Hiba a bevitt adatokban."
            })
            return
        }
        if (password !== cpassword) {
            res.json({
                status: "error",
                message: "A beírt két jelszó nem egyezik."
            })
            return
        }

        let user = await userModel.findOne({ "username": req.session.user.username }, (err, doc) => {
            if (err) myLogger("Új jelszó hozzárendelési hiba: " + err)
        })

        if (user) {
            if (!user.pwReset) {
                res.json({
                    status: "error",
                    message: "Egy Jelszó változtatás engedélyezett."
                })
            }
            let hashedNewPw = await bcrypt.hash(password, saltRounds).catch((err) => {
                myLogger("Jelszó hashelési hiba: " + err)
                return
            })

            if (hashedNewPw) {
                user.updateOne({ "password": hashedNewPw, "pwReset": false }, (err, res) => {
                    if (err) {
                        myLogger("Felhasználó felülírási hiba: " + err)
                    }
                    myLogger("Felhasználó adatai felülírva.")
                })
                await user.save()
                myLogger(`${req.session.user.username} megváltoztatta az ideiglenes jelszavát.`, req, res.statusCode)
                req.session.user.pwReset = false;
                res.json({
                    status: "OK",
                    message: "Jelszó változtatás sikeres."
                })

            }
        }

    })
    module.exports = router