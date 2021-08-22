const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const userModel = require("../userschema")
const myLogger = require("../logger")
const pwResetCheck = require('../pwResetCheck')
const cookieParser = require("cookie-parser")
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser())


router.post("/", pwResetCheck, async function (req, res) {
    const username = req.body.username
    const password = req.body.password
    let user = await userModel.findOne({ username }).catch((err) => { return myLogger("Error " + err) })
    if (user) {
        await bcrypt.compare(password, user.password).then(function (resolve, reject) {
            if (resolve) {
                if (user.isVerified) {
                    req.session.user = {
                        username: username,
                        isVerified: user.isVerified,
                        pwReset: user.pwReset,
                        role: user.role
                    }
                    req.session.authenticated = true;
                    user.updateOne({ isLoggedIn: true }).catch((err) => { myLogger(err) })
                    user.save()
                    myLogger(`${req.session.user.username} bejelentkezett.`)
                    res.cookie("username", user.username)
                    if (req.session.user.pwReset) {

                        res.json({
                            status: "OK",
                            message: "Sikeres bejelentkezés ideiglenes jelszóval. Átirányítás folyamatban."
                        })
                    }
                    else {

                        res.json({
                            status: "OK",
                            message: "Sikeres bejelentkezés. Átirányítás folyamatban..."
                        })

                    }
                } else {
                    myLogger(`${req.session.user.username} megpróbált hitelesítés előtt bejelentkezni.`)
                    res.json({
                        status: "error",
                        message: "Ez a felhasználó még nem hitelesítette a fiókját. "
                    })
                }
            }
            else {
                res.json({
                    status: "error",
                    message: "Felhasználónév vagy jelszó érvénytelen "
                })
            }

        })

    }
    else {
        return res.json({
            status: "error",
            message: "Felhasználónév vagy jelszó érvénytelen "
        })
    }
})

module.exports = router