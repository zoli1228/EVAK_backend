const express = require("express")
const router = express.Router()
const validate = require("../validation")
const bcrypt = require("bcrypt")
const userModel = require("../userschema")
const myLogger = require("../logger")
const genRandomId = require("../genRandomId")
const sendMail = require("../sendMail")
const saltRounds = 10;

router.post("/", async function (req, res) {
    const { username, email, password, cpassword } = req.body
    if (validate.validatePassword(password, cpassword) != "OK" || validate.validateUsername(username) != "OK" || validate.validateEmail(email) != "OK") {
        return res.json({
            status: "error",
            message: "Beviteli hiba: A megadott adatokban hibát találtunk."
        })
    }
    if (password !== cpassword) {
        return res.json({
            status: "error",
            message: "A jelszó és a megerősítő jelszó nem egyezik."
        })
    }
    let user = {}
    user = await userModel.findOne({ username }).catch((err) => {
        myLogger("Error   " + err)
    }) ||
        await userModel.findOne({ email }).catch((err) => {
            myLogger("Error   " + err)
        })


    if (user) {

        if (user.username == username) {

            return res.json({
                status: "error",
                message: "Ez a felhasználónév már létezik. Kérem válasszon másikat."
            })
        }
        if (user.email == email) {
            return res.json({
                status: "error",
                message: "Ez az email cím már létezik. Válasszon másikat, vagy jelentkezzen be!"
            })
        }
        return res.json({
            status: "error",
            message: "Ismeretlen hiba történt. Kérjük próbálja meg később."
        })
    }

    let pwHash = await bcrypt.hash(password, saltRounds).catch((err) => {
        myLogger(err)
    })
    let verificationId = genRandomId(64)
    user = new userModel({
        username,
        password: pwHash,
        email,
        verificationId: verificationId
    })
    await user.save().then((resolve, reject) => {
        if (resolve) return
        myLogger("User save error: " + reject)
    })

    await sendMail("verify", username, email, verificationId, 0, "Regisztráció megerősítése")
    myLogger(`${username} sikeresen regisztrált.`, req, res.statusCode)
    res.json({
        status: "OK",
        message: "Regisztráció sikeres! Küldtünk egy megerősítő emailt az Ön által megadott címre, csak megerősítés után tud majd bejelentkezni."
    })

})

module.exports = router