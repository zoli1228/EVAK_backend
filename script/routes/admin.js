const router = require("express").Router()
const auth = require("../checkAuthState")
const adminAuth = require("../checkAdmin")
const bcrypt = require("bcrypt")
const myLogger = require("../logger")
const createModule = require("../createmodule")
const pages = require("../pages")
const userModel = require("../userschema")
const workModel = require("../workschema")


router
    .post("/lists/worklist", [auth, adminAuth], async (req, res) => {
        console.log(req.body)
        let workTitle = req.body.title
        let workPrice = req.body.price
        let id = req.body.uniqueId
        let username = req.session.user.username
        let workObject = new workModel({
            "added_by": username,
            "worktitle": workTitle,
            "workprice": workPrice,
            "uniqueId" : id
        })
try {


        await workObject.save()
            .then((resolve, reject) => {
                if (resolve) {
                    myLogger("Sikeres adatbeküldés")
                    res.sendStatus(200)
                    return
                }
                myLogger("Hiba")

            }
            )
        } catch (err) {
            myLogger("hiba!!!" + err)
        }
    })
    .get("/lists/worklist", [auth, adminAuth], async (req, res) => {
        let result = await workModel.find({}).catch(err => myLogger("Hiba a munkafolyamatok lekérdezése közben: " + err))
        if(result) {
            res.status(200).json(result)

        }
    })
    .delete("/lists/worklist/:id", [auth, adminAuth], async (req, res) => {
        let id = req.params.id
        try {
            await workModel.findOneAndDelete({
                "uniqueId" : id
            }).then((resolve) => {
                if(resolve) {
                    res.sendStatus(200)
                }
            })
            
        } catch(err) {
            res.sendStatus(500)
        }
    })
    .get("/", auth, async (req, res) => {
        let adminaccess = req.session.adminaccess
        let createdModule = {
            header: "No data"
        }
        if (adminaccess) {
            createdModule = await createModule(pages.modules.admin.main, {
                header: "Admin főmenü"
            })
        } else {
            createdModule = await createModule(pages.modules.admin.landing, {
                header: "Admin bejelentkezés"
            })
        }
        res.status(200).json(createdModule)
    })
    .get("/:path", [auth, adminAuth], async (req, res) => {
        let path = req.params.path
        let createdModule = {
            template: "no data",
            header: "No data"
        }
        switch (path) {
            case "dbactions":
                createdModule = await createModule(pages.modules.admin.dbactions, {
                    header: "Munkafolyamatok kezelése"
                })
                break;
        }
        res.status(200).json(createdModule)
    })
    .post("/login", async (req, res) => {
        const username = req.body.username
        const password = req.body.password
        let user = await userModel.findOne({ username }).catch((err) => { return myLogger("Error " + err) })
        if (user) {
            await bcrypt.compare(password, user.password).then(function (resolve, reject) {
                if (resolve) {
                    if (user.role == "admin") {
                        req.session.adminaccess = true

                        myLogger(`${req.session.user.username} bejelentkezett az admin menübe.`)
                        /* let template = createModule(pages.modules.admin.main, {
                            header: "Admin getz"
                        }) */

                        res.json({
                            status: "OK",
                            message: "Bejelentkezés sikeres.",
                        })
                    }
                    else {
                        res.json({
                            status: "error",
                            message: "A bejelentkezéshez adminisztrátori jog szükséges."
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