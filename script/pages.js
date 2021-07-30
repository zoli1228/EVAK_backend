const path = require("path")
let loadModule = (input) => {
    return path.resolve("..", "EVAK-0.0.1", "pages", "modules", `${input}`)
}
let loadPage = (input) => {
    return path.resolve("..", "EVAK-0.0.1", "pages", `${input}`)
}

module.exports = {
    underCs: path.resolve("..", "EVAK-0.0.1", "public", "underconstruction.html"),
    notFound: path.resolve("..", "EVAK-0.0.1", "public", "404.html"),
    app: path.resolve("..", "EVAK-0.0.1", "app.html"),
    
    home: loadPage("home.html"),
    support: loadPage("support.html"),
    main: loadPage("protected.html"),
    changepassword: loadPage("changepassword.html"),
    recovery: loadPage("pwrecovery.html"),
    signedup: loadPage("signedup.html"),
    aszf: loadPage("aszf.html"),
    modules: {
        test: loadModule("testtemplate.html"),
        fapapucs: loadModule("fapapucs.html"),
        homepage: loadModule("homepage.html")
    }
}