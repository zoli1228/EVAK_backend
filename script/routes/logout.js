const express = require("express")
const router = express.Router()
const auth = require("../checkAuthState")
const userModel = require("../userschema")
const myLogger = require("../logger")

router.get('/', auth, async function (req, res) {
    if (req.session.user) {
        let user = await userModel.findOne({ username: req.session.user.username })

        await user.updateOne({ "isLoggedIn": false }).catch((err) => {
            myLogger(err)
        })
        user.save()

        myLogger(user.username + " kijelentkezett.")
        req.session.destroy();
        res.redirect("/");
    }
    else {
        res.json({ message: "Unable to log out. You are not logged in." })
    }
});

module.exports = router