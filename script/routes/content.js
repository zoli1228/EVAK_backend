const router = require("express").Router()
const auth = require("../checkAuthState")

const createModule = require("../createmodule")
const pages = require("../pages")

router
    .get("/quotes/:page", auth, async (req, res) => {
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
        }
        res.json(loadedModule)

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