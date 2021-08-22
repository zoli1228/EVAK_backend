const express = require("express")
const router = express.Router()
const userModel = require("../userschema")
const myLogger = require("../logger")
const bcrypt = require("bcrypt")
const genRandomId = require("../genRandomId")
const sendMail = require("../sendMail")

router.route("/")

    .get(function (req, res) {
        res.sendFile(pages.recovery)

    })
    .post(async function (req, res) {
        const email = req.body.email
        let user = await userModel.findOne({ email: email }).catch((err) => {
            myLogger("Error: " + err);
            return
        })

        if (user) {
            myLogger("PWRecovery: Egyezés! Felhasználói jelszó visszaállítása: " + user.username)
            let newPassword = genRandomId(8)
            let hashedNewPw = await bcrypt.hash(newPassword, saltRounds).then().catch((err) => {
                myLogger("Hash hiba!: " + err);
                return res.send("Hiba")
            })
            let currentDate = Math.floor((Date.now() / 1000 / 3600 / 24))
            user.updateOne({ "password": hashedNewPw, "pwReset": true, "pwResetDateUnix": currentDate }).then((data) => {
                myLogger("Jelszó frissítve!")
                user.save()
                sendMail("pwrecovery", user.username, user.email, 0, newPassword, "Elfelejtett jelszó")
                return res.json({
                    status: "OK",
                    message: "Ideiglenes jelszó elküldve."
                })
            }).catch((err) => {
                myLogger("Jelszó frissítési hiba: " + err)
                return res.json({
                    status: "error",
                    message: "Hiba történt: " + err
                })
            })
        }
        else {
            myLogger("PWRecovery: Nincs ilyen email cím a rendszerben: " + req.body.email)
            res.json({
                status: "OK",
                message: `Amennyiben a '${req.body.email}' cím regisztrálva van a rendszerünkben, úgy kapni fog egy levelet az új jelszóval.`
            })
        }
    })

module.exports = router