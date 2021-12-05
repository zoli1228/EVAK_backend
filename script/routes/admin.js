const router = require("express").Router()
const auth = require("../checkAuthState")
const adminAuth = require("../checkAdmin")
const bcrypt = require("bcrypt")
const myLogger = require("../logger")
const createModule = require("../createmodule")
const pages = require("../pages")
const userModel = require("../userschema")
const workModel = require("../workschema")
const matModel = require("../materialschema")
const timeStamp = require("../timestamp")


router
    .post("/lists/worklist", [auth, adminAuth], async (req, res) => {

        let workTitle = req.body.title
        let workCategory = req.body.category

        let workCategoriesArray = ["Alapszerelés", "Vezetékbehúzás", "Kamerarendszer", "Riasztórendszer", "Gyengeáram", "Szerelvényezés", "Fényforrások szerelése", "Földelés kiépítése", "Mérőhely kialakítás", "Készülékek beüzemelése", "Hibakeresés", "Eseti javítások", "Tervezés", "Szaktanácsadás", "Egyéb költségek",]

        let workPrice = req.body.price
        let id = req.body.uniqueId
        let username = req.session.user.username
        let workObject = new workModel({
            "added_by": username,
            "worktitle": workTitle,
            "category": workCategoriesArray[workCategory - 1],
            "workprice": workPrice,
            "uniqueId": id
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
        if (result) {
            res.status(200).json(result)

        }
    })
    .delete("/lists/worklist/:id", [auth, adminAuth], async (req, res) => {
        let id = req.params.id
        try {
            await workModel.findOneAndDelete({
                "uniqueId": id
            }).then((resolve) => {
                if (resolve) {
                    res.sendStatus(200)
                }
            })

        } catch (err) {
            res.sendStatus(500)
        }
    })
    .post("/lists/materiallist", [auth, adminAuth], async (req, res) => {

        let { title, price, category, tags } = req.body
        let tagsLowercase = []
        tags.forEach(element => {
            if (element) {
                tagsLowercase.push({
                    "key": `${element["key"].toLowerCase()}`,
                    "value": `${element["value"].toLowerCase()}`
                })
            }

        })

        let materialObject = new matModel({
            "title": title.toLowerCase(),
            "price": price.toLowerCase(),
            "category": category.toLowerCase(),
            "tags": tagsLowercase,
            "added_at": timeStamp("/"),
            "added_by": req.session.user.username
        })

        try {
            await materialObject.save().then(resolve => {
                if (resolve) {

                    myLogger("Sikeres adatbeküldés: " + materialObject)
                    res.sendStatus(200)
                    return
                }
            },
                reject => {

                    throw reject.message
                })
        }

        catch (err) {
            myLogger(err)
            res.status(406).json({ "message": err })
        }

    })
    .get("/lists/materiallist/:key&:value&:location", [auth, adminAuth], async (req, res) => {
        let paramKey, paramValue, paramLocation;
        req.params.key ? paramKey = req.params.key : paramKey = "none"
        req.params.value ? paramValue = req.params.value : paramKey = "none"
        req.params.location ? paramLocation = req.params.location : "root"

        let query = {}
        if (paramKey == "none" && paramValue == "none" && paramLocation == "root") {
            query = {}
        } else if (paramLocation == "tags") {
            query = {
                tags: {
                    "key": paramKey,
                    "value": paramValue
                }
            }
        }
        else if (paramLocation == "root") {
            query[paramKey] = paramValue
        }
        try {
            await matModel.find(query).sort({ "category": 1 })
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(err => {
                    res.status(406).json({ "message": `Hiba az adatok lekérdezése közben. Hibaüzenet: ${err}` })
                    console.log(err)
                })

        } catch (err) {
            res.status(500).json({ "message": `Hiba az adatok lekérdezése közben. Hibaüzenet: ${err}` })
            myLogger(`* Hiba miközben ${req.session.user} adatokat kért le a "materialslist" táblából. Hiba: ${err}`)
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
            case "materiallist":
                createdModule = await createModule(pages.modules.admin.materiallist, {
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