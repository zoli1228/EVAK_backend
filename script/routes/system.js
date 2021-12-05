const express = require("express")
const router = express.Router()
const userModel = require("../userschema")
const myLogger = require("../logger")

router
.get("/getuserdetails", async (req, res) => {
    if(req.session.user) {
        await userModel.findOne({ username: req.session.user.username })
        .then(response => {
            if(response.role == "admin") {
            let adminNav = `<a href="#" onclick="selectPage('admin')" class="nav_button1"><i class="fas fa-arrow-circle-right nav_button1_arrow" ></i>Admin menü</a>`
            res.status(200).json({
                username: response.username,
                role: response.role,
                adminmenu: adminNav
            })
        } else {
            res.status(200).json({
            username: response.username,
            role: response.role
        })
        }
        
        })
        .catch(err => {
            res.status(503).json({ message : "Hiba az adatok lekérdezésében. Az adatbázis technikai okok miatt nem elérhető." })
            myLogger(err)
        })
        
    }
    else {
        res.status(404).json({
            message: "A keresett tartalom nem található."
        })
    }
})

module.exports = router