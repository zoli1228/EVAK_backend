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
    admin: loadPage("admin.html"),
    home: loadPage("home.html"),
    support: loadPage("support.html"),
    main: loadPage("protected.html"),
    changepassword: loadPage("changepassword.html"),
    recovery: loadPage("pwrecovery.html"),
    signedup: loadPage("signedup.html"),
    aszf: loadPage("aszf.html"),
    modules: {
        admin: {
            landing: loadModule("admin/landing.html"),
            dbactions: loadModule("admin/dbactions.html"),
            main: loadModule("admin/main.html"),
            materiallist: loadModule("admin/materiallist.html")
        },
        test: loadModule("testtemplate.html"),
        homepage: loadModule("homepage.html"),
        chat: {
            chat: loadModule("chat/chat.html"),
            landing: loadModule("chat/landing.html")
        },
        settings: loadModule("settings.html"),
        profile: loadModule("profile.html"),
        forum: loadModule("forum.html"),
        help: loadModule("help.html"),
        notfound: loadModule("404.html"),
        quotes:  {
            admin: loadModule("quotes/admin.html"),
           quotes: loadModule("quotes/quotes.html"),
           landing: loadModule("quotes/landing.html"),
           newquote: loadModule("quotes/newquote.html")
        }
    }
}