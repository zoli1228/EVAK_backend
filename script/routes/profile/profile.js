const router = require("express").Router()
const path = require("path")
const auth = require(path.resolve("script", "checkAuthState.js"))
const myLogger = require(path.resolve("script", "logger.js"))
const timestamp = require(path.resolve("script", "timestamp.js"))
const val = require(path.resolve("script", "escapeHtml.js"))
const createModule = require(path.resolve("script", "createmodule.js"))
const pages = require(path.resolve("script", "pages"))
const checkDate = require(path.resolve("script", "isFutureDate"))
const quoteSchema = require(path.resolve("script", "quoteSchema.js"))

router
.get("/", async(req, res) => {
    let loadedModule = await createModule(pages.modules.profile, {
        header: "Személyes adatlap"
    })
    res.json(loadedModule)
})

module.exports = router