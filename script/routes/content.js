const router = require("express").Router()
const auth = require("../checkAuthState")
const myLogger = require("../logger.js")
const timestamp = require("../timestamp.js")
const val = require("../escapeHtml")
const createModule = require("../createmodule")
const pages = require("../pages")
const checkDate = require("../isFutureDate")

const quoteSchema = require("../quoteSchema.js")

router
    .get("/quotes/:page", auth, async (req, res, next) => {
        let page = req.params.page
        switch (page) {
            case "landing":
                var loadedModule = await createModule(pages.modules.quotes.landing, {
                    header: "Árajánlatok"
                })
                break;

            case "quotes":
                var loadedModule = await createModule(pages.modules.quotes.quotes, {
                    header: "Árajánlatok"
                })
                break;
            case "newquote":
                var loadedModule = await createModule(pages.modules.quotes.newquote, {
                    header: "Új árajánlat készítése"
                })
                break;
            case "list":
                return next()
        }
        res.json(loadedModule)

    })
    .post("/quotes/savequote", auth, async (req, res) => {
        
        let d = req.body
        
        let time = timestamp()
        let today = new Date()
        let quote = new quoteSchema({
            username: req.session.user.username,
            timestamp: time,
            createdAt: today.toISOString(),
            modifiedAt: today.toISOString(),
            clientname: val(d.clientname),
            clientaddress: val(d.clientaddress),
            contract_type: d.contract_type,
            serialnumber: val(d.serialnumber),
            worklist: d.worklist,
            materiallist: d.materiallist,
            netPrice: d.netPrice,
            discount: d.discount,
            discountValue: d.discountValue,
            valueAfterDiscount: d.valueAfterDiscount,
            taxCode: d.taxCode,
            taxAmount: d.taxAmount,
            grossTotal: d.grossTotal,
            expiryDate: new Date(d.expiryDate).toISOString(),
            globalMatMultiplier: d.globalMatMultiplier,
            globalNormPrice: d.globalNormPrice,
        })
        try { 
        if (quote.expiryDate) {
            isFutureDate = checkDate(quote.expiryDate)
            if (!isFutureDate) {
                res.status(406).json({
                    statusMessage: "ERROR",
                    message: [
                        "Hiba", "red",
                        "A lejárati dátum minimum 1 nappal a kiállítási dátum", "white",
                        "után kell, hogy legyen.", "white"
                    ]
                })
                return
            }
        } else {
            res.status(406).json({
                statusMessage: "ERROR",
                message: [
                    "Hiba", "red",
                    "Érvényességi idő meghatározása kötelező.", "white"
                ]
            })
            return
        }
    } catch(err) {
        myLogger("HIBA! Árajánlat hozzáadása közben: " + err, req, 500)
        res.status(500).json({
            statusMessage: "ERROR",
            message: [
                "Szerver oldali hiba történt", "red",
                "A hiba oka ismeretlen. Amennyiben szeretne hibajelentést", "white",
                "tenni, azt megteheti az", "white",
                "info@evak.hu", "#cf0",
                "email címen. Elnézést a kellemetlenségért.", "white"
            ]
        })
        return
    }
        try {

            await quote.save().then(
                (result) => {
                    myLogger("Árajánlat mentés sikeres: " + result, req, 200)
                    res.status(200).json({
                        statusMessage: "OK",
                        message: ["Árajánlat sikeresen elmentve.", "white"]
                    })

                }
            )

        } catch (error) {
            let err = error.toString()
            let errorMessage = ["Hiba", "red", "Ismeretlen hiba történt.", "white"];

            if (err.includes("E11000")) {
                errorMessage = ["Ez a sorozatszám már létezik.", "red", "Kérjük frissítse a sorozatszámot az űrlap tetején", "white", "a sorozatszám mellett található gomb megnyomásával.", "white"]
            }
            else if (err.includes("ValidationError")) {

                errorMessage = ["Kötelező adatok hiányoznak.", "red", "Kérjük nézze át az űrlapot,", "white", "és minden hiányzó adatot töltsön ki.", "white"]
            }
            myLogger("*** *** HIBA ÜZENET! *** ***")
            myLogger("Árajánlat mentési hiba: " + err, req, 500)



            res.status(500).json({
                statusMessage: "ERROR",
                message: errorMessage
            })
        }
    }
    )
    .get("/quotes/list", auth, async (req, res) => {
        await quoteSchema.find({ username: req.session.user.username }).then(
            result => {
                res.json(result)
            }
        )
    })
    .get("/settings", auth, async (req, res) => {
                let loadedModule = await createModule(pages.modules.settings, {
                    header: "Beállítások"
                })
                res.json(loadedModule)
            })
    .get("/chat/:page", auth, async (req, res) => {
        let page = req.params.page
        let user = req.session.user.username
        switch (page) {
            case "landing":
                var loadedModule = await createModule(pages.modules.chat.landing, {
                    header: "Csevegés"
                })
                break;

            case "chat":
                var loadedModule = await createModule(pages.modules.chat.chat, {
                    header: "Csevegés"
                }, user)
                break;
        }
        res.json(loadedModule)
    })
    .get("/home", auth, async (req, res) => {
        let user = req.session.user.username
        let loadedModule = await createModule(pages.modules.homepage, {
            header: "Főoldal"
        }, user)
        res.json(loadedModule)

    })
    .get("/profile", auth, async (req, res) => {
        let loadedModule = await createModule(pages.modules.profile, {
            header: "Személyes adatlap"
        })
        res.json(loadedModule)
    })
    .get("/forum", auth, async (req, res) => {
        let loadedModule = await createModule(pages.modules.forum, {
            header: "Fórum"
        })
        res.json(loadedModule)
    })
    .get("/help", auth, async (req, res) => {
        let loadedModule = await createModule(pages.modules.help, {
            header: "Segítség"
        })
        res.json(loadedModule)
    })/* .get("/admin", [auth, adminAuth], async (req, res) => {
        let loadedModule = await createModule(pages.modules.admin.landing, {
            header: "Admin felület"
        })
        res.json(loadedModule)
        
    }) */
    .get("/*", auth, async (req, res) => {
        let loadedModule = await createModule(pages.modules.notfound, {
            header: "Hiba"
        })
        res.json(loadedModule)
    })

module.exports = router