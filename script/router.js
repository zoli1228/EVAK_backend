const express = require("express");

const router = express.Router()
const clientAddress = require("./getclientaddress.js")
const adminIp = "149.200.101.113"
const guestIp = "1"
const path = require('path')
const bodyParser = require('body-parser')
const auth = require('./checkAuthState.js')
const myLogger = require('./logger.js') // (Message, req, status) (if !req && !status) {message with timestamp}
const pages = require("./pages.js");
const cookieParser = require("cookie-parser")
const mongoose = require('mongoose');
router.use(bodyParser.json())
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser())
const userSession = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(userSession)
const blackListed = require('./BLACKLIST')

    router.use((req, res, next) => {
        let hostAddress = clientAddress.getClientAddress(req)
        if(blackListed.includes(hostAddress)) {
            myLogger("Request from blacklisted IP address")
           return res.status(418).send("Your IP address is blacklisted on this site.")
        }
        else {
            next()
        }

    })

    let usersMongoStore = new MongoDBStore({
        uri: 'mongodb://localhost:27017/evak',
        collection: 'usersessions',
    });
    
    usersMongoStore.on('error', function (error) {
        myLogger(error);
    });

    router.use(require('express-session')({
        secret: 'fd532d1539d094c47681dd6db74242d26a02af39132f3f7ea470507321eb847e',
        cookie: {
            expires: 1000 * 60 * 60 * 24,
            maxAge: 1000 * 60 * 60 * 24,// 1 day
            httpOnly: false,
            secure: true
        },
        store: usersMongoStore,
        resave: true,
        saveUninitialized: false,
        rolling: true,
        connectionOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 2000
        }
    
    }));


let mongoDB = 'mongodb://localhost:27017/evak';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    serverSelectionTimeoutMS: 2000
})
.then(resolve => {
    myLogger("MONGO DB EVAK KAPCSOLÓDÁS SIKERES")
})
.catch(err => {
    myLogger("MONGO ERROR:  " + err)
    return
})
let db = mongoose.connection;
db.on('error', (error) => {
    return myLogger("MONGODB HIBA: " + error)
});



router.use((req, res, next) => {
    if (clientAddress.getClientAddress(req) == adminIp || clientAddress.getClientAddress(req) == guestIp) {
       return next()
    }
    else {
        myLogger("Oldalfelkeresés" , req)
        res.sendFile(pages.underCs)
    }
})


router.use((req, res, next) => {
    try {
    let origin = req.headers.origin
    if (req.headers.origin == "http://localhost:8000" || req.headers.origin == "https://www.evak.hu") {

        res.setHeader("Access-Control-Allow-Origin", `${origin}`);
    }

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
}   catch(err) {
    myLogger("Hiba a header-ek beállítása közben.  :   " + err)
}
});
const routes = {
    system: require("./routes/system"),
    registration: require("./routes/registration"),
    login: require("./routes/login"),
    verify: require("./routes/verify"),
    logout: require("./routes/logout"),
    pwrecovery: require("./routes/passwordrecovery"),
    newpw: require("./routes/newpassword"),
    main: require("./routes/main"),
    content: require("./routes/content"),
    chat: require("./routes/chat"),
    admin: require("./routes/admin")
}





router.use("/system", routes.system)
router.use("/signup", routes.registration)
router.use("/login", routes.login)
router.use("/verify", routes.verify)
router.use("/logout", routes.logout)
router.use("/passwordrecovery", routes.pwrecovery)
router.use("/newpassword", routes.newpw)
router.use("/main", routes.main)
router.use("/content", routes.content)
router.use("/chat", routes.chat)
router.use("/admin", routes.admin)

router
    .get('/signedup', function (req, res) {
        res.sendFile(pages.signedup)
    })
    .get("/aszf", (req, res) => {
        res.sendFile(pages.aszf);
    })
    .get("/", function (req, res) {
        if (!req.session?.user) {
            res.sendFile(pages.home)
        } else if (req.session.user.isVerified && !req.session.user.pwReset) {
            res.sendFile(pages.main)
        } else if (req.session.user.pwReset) {
            res.sendFile(pages.changepassword)
        } 
        else {
            res.sendFile(pages.home)
        }
    })



router.get("/quotes/list", auth, async (req, res) => {

})

router.get("/session", auth, async (req, res) => {
    res.send(req.session)
})


router.use(function (req, res) {
    res.status(404).sendFile(path.resolve(pages.notFound));
});

router.use(function (req, res) {
    res.status(401).sendFile(path.resolve(pages.home));
});


router.use(function (err, req, res, next) {
    res.status(500).send('500: Internal Server Error ' + err);
});





module.exports = router;