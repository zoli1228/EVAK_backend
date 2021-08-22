const express = require("express");
const router = express.Router()
const userModel = require("../userschema")
const myLogger = require("../logger")
const verPage = require("../sendVerifiedPage")



router.get('/', async function (req, res) {

    let id = req.query.id
    let user = await userModel.findOne({ verificationId: id }).catch((err) => {
        res.send("Nem található")
    })
    if (!user) {
        res.send("Ez a hitelesítő kód lejárt.")
        return
    }
    else if (user) {
        user.updateOne({ "isVerified": true, "verificationId": "verified" }, function (err) {
            if (err) {
                myLogger(err)
                return res.send("Error!: " + err)

            }
            user.save()
            myLogger(`${user.username} igazolta az email címét (${user.email})`)
            let dataToSend = verPage(user.username)
            res.send(dataToSend)
        })
    } else if (user.verificationId == "verified") {
        res.json({ message: "Ez a felhasználó már hitelesítve van." })
    }
    else res.json({ message: "Felhasználó nem található az adatbázisban." })
})

module.exports = router