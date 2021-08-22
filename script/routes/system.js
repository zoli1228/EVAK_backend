const express = require("express")
const router = express.Router()
const userModel = require("../userschema")

router
.get("/getuserdetails", async (req, res) => {
    if(req.session.user) {
        let user = await userModel.findOne({ username: req.session.user.username }).catch((err) => res.status(500).send("Hiba az adatok lekérdezésében"))
        if(user.role == "admin") {
            let adminNav = `<a href="#" onclick="selectPage('admin')" class="nav_button1"><i class="fas fa-arrow-circle-right nav_button1_arrow" ></i>Admin menü</a>`
            res.json({
                username: user.username,
                role: user.role,
                adminmenu: adminNav
            })
        } else {
            res.json({
            username: user.username,
            role: user.role
        })
        }
        
    }
    else {
        res.sendStatus(404)
    }
})

module.exports = router