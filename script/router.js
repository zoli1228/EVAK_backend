const express = require("express");
const router = express.Router()
//const logger = require("./logger.js")
const clientAddress = require("./getclientaddress.js")
const adminIp = "81.182.138.150"
const path = require('path')
const bcrypt = require('bcrypt')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose');
const userModel = require('./userschema.js')
const bodyParser = require('body-parser')
const sendMail = require('./sendMail')
const genRandomId = require('./genRandomId')
const validate = require('./validation')
const auth = require('./checkAuthState.js')
const myLogger = require('./logger.js') // (Message, req, status) (if !req && !status) {message with timestamp}
const pwResetCheck = require('./pwResetCheck')
const pages = require("./pages.js")
const saltRounds = 10

let mongoDB = 'mongodb://localhost:27017/evak';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    serverSelectionTimeoutMS: 5000
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
let mongoStore = new MongoDBStore({
    uri: 'mongodb://localhost:27017/evak',
    collection: 'evaksessions'
});

mongoStore.on('error', function (error) {
    myLogger(error);
});




router.use(require('express-session')({
    secret: 'fd532d1539d094c47681dd6db74242d26a02af39132f3f7ea470507321eb847e',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,// 1 day
        httpOnly: false,
        secure: true
    },
    store: mongoStore,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
    }

}));

router.use(function (req, res, next) {
    if (clientAddress.getClientAddress(req) == adminIp) {
        next()
    }
    else {
        res.sendFile(pages.underCs)
    }
})

router.use(bodyParser.json())
router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://evak.hu");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});






router.post("/signup", async function (req, res) {
    const { username, email, password, cpassword } = req.body
    myLogger("User registration process started")

    if (validate.validatePassword(password, cpassword) != "OK" || validate.validateUsername(username) != "OK" || validate.validateEmail(email) != "OK") {
        return res.json({
            status: "error",
            message: "Beviteli hiba: A megadott adatokban hibát találtunk."
        })
    }
    if (password !== cpassword) {
        return res.json({
            status: "error",
            message: "A jelszó és a megerősítő jelszó nem egyezik."
        })
    }
    let user = {}
    user = await userModel.findOne({ username }).catch((err) => {
        myLogger("Error   " + err)
    }) ||
        await userModel.findOne({ email }).catch((err) => {
            myLogger("Error   " + err)
        })


    if (user) {

        if (user.username == username) {

            return res.json({
                status: "error",
                message: "Ez a felhasználónév már létezik. Kérem válasszon másikat."
            })
        }
        if (user.email == email) {
            return res.json({
                status: "error",
                message: "Ez az email cím már létezik. Válasszon másikat, vagy jelentkezzen be!"
            })
        }
        return res.json({
            status: "error",
            message: "Ismeretlen hiba történt. Kérjük próbálja meg később."
        })
    }

    let pwHash = await bcrypt.hash(password, saltRounds).catch((err) => {
        myLogger(err)
    })
    let verificationId = genRandomId(64)
    user = new userModel({
        username,
        password: pwHash,
        email,
        verificationId: verificationId
    })
    await user.save().then((resolve, reject) => {
        if (resolve) return
        myLogger("User save error: " + reject)
    })

    await sendMail("verify", username, email, verificationId, 0, "Regisztráció megerősítése")
    myLogger(`${username} sikeresen regisztrált.`, req, res.statusCode)
    res.json({
        status: "OK",
        message: "Regisztráció sikeres! Küldtünk egy megerősítő emailt az Ön által megadott címre, csak megerősítés után tud majd bejelentkezni."
    })

})

router.post("/login", pwResetCheck, async function (req, res) {

    const username = req.body.username
    const password = req.body.password
    let user = await userModel.findOne({ username }).catch((err) => { return myLogger("Error " + err) })
    if (user) {
        await bcrypt.compare(password, user.password).then(function (resolve, reject) {
            if (resolve) {

                if (user.isVerified) {
                    req.session.user = {
                        username: username,
                        isVerified: user.isVerified,
                        pwReset: user.pwReset
                    }
                    req.session.authenticated = true;
                    user.updateOne({ isLoggedIn: true }).catch((err) => { myLogger(err) })
                    user.save()
                    myLogger(`${req.session.user.username} bejelentkezett.`)
                    if (req.session.user.pwReset) {
                        res.json({
                            status: "OK",
                            message: "Sikeres bejelentkezés ideiglenes jelszóval. Átirányítás folyamatban."
                        })
                    }
                    else {
                        res.json({
                            status: "OK",
                            message: "Sikeres bejelentkezés. Átirányítás folyamatban..."
                        })

                    }
                } else {
                    myLogger(`${req.session.user.username} megpróbált hitelesítés előtt bejelentkezni.`)
                    res.json({
                        status: "error",
                        message: "Ez a felhasználó még nem hitelesítette a fiókját. "
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

router.get('/signedup', function (req, res) {
    res.sendFile(pages.signedup)
})




router.get('/verify', async function (req, res) {
    let verPage = require('./sendVerifiedPage.js')
    let id = req.query.id
    let user = await userModel.findOne({ verificationId: id }).catch((err) => {
        res.send("Nem található")
    })
    if (!user) {
        res.send("Ez a hitelesítő kód lejárt.")
        return
    }
    else if (user) {
        user.updateOne({ "isVerified": true, "verificationId": "verified" }, function (err) {
            if (err) {
                myLogger(err)
                return res.send("Error!: " + err)

            }
            user.save()
            myLogger(`${user.username} igazolta az email címét (${user.email})`)
            let dataToSend = verPage(user.username)
            res.send(dataToSend)
        })
    } else if (user.verificationId == "verified") {
        res.json({ message: "Ez a felhasználó már hitelesítve van." })
    }
    else res.json({ message: "Felhasználó nem található az adatbázisban." })
})

router.get('/logout', async function (req, res) {

    if (req.session.user) {
        let user = await userModel.findOne({ username: req.session.user.username })

        await user.updateOne({ "isLoggedIn": false }).catch((err) => {
            myLogger(err)
        })
        user.save()

        myLogger(user.username + " kijelentkezett.")
        req.session.destroy();
        res.redirect("/");
    }
    else {
        res.json({ message: "Unable to log out. You are not logged in." })
    }
});

router.get('/passwordrecovery', function (req, res) {
    res.sendFile(pages.recovery)

})
router.post('/passwordrecovery', async function (req, res) {
    const email = req.body.email
    let user = await userModel.findOne({ email: email }).catch((err) => {
        myLogger("Error: " + err);
        return
    })

    if (user) {
        myLogger("PWRecovery: Egyezés! Felhasználói jelszó visszaállítása: " + user.username)
        let newPassword = genRandomId(8)
        let hashedNewPw = await bcrypt.hash(newPassword, saltRounds).then().catch((err) => {
            myLogger("Hash hiba!: " + err);
            return res.send("Hiba")
        })
        let currentDate = Math.floor((Date.now() / 1000 / 3600 / 24))
        user.updateOne({ "password": hashedNewPw, "pwReset": true, "pwResetDateUnix": currentDate }).then((data) => {
            myLogger("Jelszó frissítve!")
            user.save()
            sendMail("pwrecovery", user.username, user.email, 0, newPassword, "Elfelejtett jelszó")
            return res.json({
                status: "OK",
                message: "Ideiglenes jelszó elküldve."
            })
        }).catch((err) => {
            myLogger("Jelszó frissítési hiba: " + err)
            return res.json({
                status: "error",
                message: "Hiba történt: " + err
            })
        })
    }
    else {
        myLogger("PWRecovery: Nincs ilyen email cím a rendszerben: " + req.body.email)
        res.json({
            status: "OK",
            message: `Amennyiben a '${req.body.email}' cím regisztrálva van a rendszerünkben, úgy kapni fog egy levelet az új jelszóval.`
        })
    }
})


router.get("/newpassword", auth, function (req, res, next) {
    if (req.session) {
        if (req.session.user.pwReset) {
            res.sendFile(pages.changepassword)

        }
        else {
            res.redirect("/")
        }
    }
})

router.post("/newpassword", auth, async function (req, res) {
    let { password, cpassword } = req.body
    if (validate.validatePassword(password, cpassword) != "OK") {
        res.json({
            status: "error",
            message: "Hiba a bevitt adatokban."
        })
        return
    }
    if (password !== cpassword) {
        res.json({
            status: "error",
            message: "A beírt két jelszó nem egyezik."
        })
        return
    }

    let user = await userModel.findOne({ "username": req.session.user.username }, (err, doc) => {
        if (err) myLogger("Új jelszó hozzárendelési hiba: " + err)
    })

    if (user) {
        if (!user.pwReset) {
            res.json({
                status: "error",
                message: "Egy Jelszó változtatás engedélyezett."
            })
        }
        let hashedNewPw = await bcrypt.hash(password, saltRounds).catch((err) => {
            myLogger("Jelszó hashelési hiba: " + err)
            return
        })

        if (hashedNewPw) {
            user.updateOne({ "password": hashedNewPw, "pwReset": false }, (err, res) => {
                if (err) {
                    myLogger("Felhasználó felülírási hiba: " + err)
                }
                myLogger("Felhasználó adatai felülírva.")
            })
            await user.save()
            myLogger(`${req.session.user.username} megváltoztatta az ideiglenes jelszavát.`, req, res.statusCode)
            req.session.user.pwReset = false;
            res.json({
                status: "OK",
                message: "Jelszó változtatás sikeres."
            })

        }
    }

})

router.get("/aszf", (req, res) => {
    res.sendFile(pages.aszf);
})

// FIND ADMIN IP TO GRANT ACCESS PERMISSION, OTHERWISE SHOW UNDERCONSTRUCTION


//   logger.myLogger(req, "Main page accessed", res.statusCode)

router.get("/", function (req, res) {
    if (!req.session?.user) {
        res.sendFile(pages.home)
    } else if (req.session.user.isVerified && !req.session.user.pwReset) {
        res.sendFile(pages.main)
    } else if (req.session.user.pwReset) {
        res.sendFile(pages.changepassword)
    } else {
        res.sendFile(pages.home)
    }
})

router.get("/main", auth, function (req, res) {
    if (req.session.user.pwReset) {
        res.redirect("/newpassword")
    }
    else {
        if (req.session.user) {
            if (req.session.user.isVerified) {
                res.sendFile(pages.main)
            } else {
                res.json({
                    message: "Ez a fiók még nem lett hitelesítve."
                })
            }
        } else {
            res.redirect("/")
        }
    }
})


router.get("/content/quotes", (req, res) => {

    res.sendFile(pages.modules.test)

}).get("/content/settings", (req, res) => {
    res.sendFile(pages.modules.settings)
}).get("/content/main", (req, res) => {
    res.sendFile(pages.modules.homepage)
}).get("/content/fapapucs", (req, res) => {
    res.sendFile(pages.modules.fapapucs)
}).get("/content/*", (req, res) => {
    res.status(404).json({ content: "404 A keresett tartalom nem található." })
})





router.use(function (req, res) {
    res.status(404).sendFile(path.resolve(pages.underCs));
});

router.use(function (err, req, res, next) {
    res.status(500).send('500: Internal Server Error ' + err);
});





module.exports = router;