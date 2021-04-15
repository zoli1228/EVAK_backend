const express = require("express");
const router = express.Router()
const logger = require("./logger.js")
const clientAddress = require("./getclientaddress.js")
const adminIp = "81.182.137.43"
const path = require('path')
const bcrypt = require('bcrypt')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose');
const userModel = require('./userschema.js')
const mailTemplate = require('./mailTemplates')
const axios = require('axios')
const bodyParser = require('body-parser')
const sendMail = require('./sendMail')
const genRandomId = require('./genRandomId')


let mongoDB = 'mongodb://localhost:27017/evak';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let mongoStore = new MongoDBStore({
    uri: 'mongodb://localhost:27017/evak',
    collection: 'evaksessions'
});

mongoStore.on('error', function (error) {
    console.log(error);
});

let checkAuthState = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    }
    else {
        res.json({
            message: "You have no permission to visit this page. Please log in!"
        })

    }
}



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


const pages = {
    underCs: path.resolve("..", "EVAK-0.0.1", "public", "underconstruction.html"),
    notFound: path.resolve("..", "EVAK-0.0.1", "public", "404.html"),
    home: path.resolve("..", "EVAK-0.0.1", "pages", "home.html"),
    support: path.resolve("..", "EVAK-0.0.1", "pages", "support.html"),
    app: path.resolve("..", "EVAK-0.0.1", "app.html"),
    protected: path.resolve("..", "EVAK-0.0.1", "pages", "protected.html"),
    signedup: path.resolve("..", "EVAK-0.0.1", "pages", "signedup.html"),
}


/* router.post("/signup", async function (req, res) {
    const { username, email, password } = req.body
    let user = await userModel.findOne({ username })
    if (user) {
        if(user.username == username){

            return res.json({
                message: "This username already exists. Please choose another one."
            })
        }
        if(user.email == email) {
            return res.json({
                message: "This email address is already in use. Please choose another one."
            })
        }
        return res.json({
            message: "User already exists."
        })
    }

    console.log("Creating user: " + username)
    let pwHash = await bcrypt.hash(password, 10)
    let verificationId = genRandomId()
    user = new userModel({
        username,
        password: pwHash,
        email,
        verificationId: verificationId
    })
    await user.save()
    console.log("User created: " + JSON.stringify(user))
    await sendMail(username, email, verificationId, "verify")
    res.redirect(`/signedup?user=${username}`)
}) */

router.post("/signup", async function (req, res) {
    const {username, email, password, cpassword} = req.body

    console.log("Password: " + password)
    console.log("CPassword: " + cpassword)
     if (password !== cpassword) {
        return res.json({
            status: "error",
            message: "A jelszó és a megerősítő jelszó nem egyezik."
        })
    }
    let user = {}
    user = await userModel.findOne({username}).catch((err) => {
        console.log("Error   " + err)
    }) ||
    await userModel.findOne({email}).catch((err) => {
        console.log("Error   " + err)
    })

     
    if (user) {
        console.log("User Object: " + JSON.stringify(user))
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
     
        console.log("Creating user: " + username)
        let pwHash = await bcrypt.hash(password, 10).catch((err) => {
           return console.log("Error hashing PW: "+err)
        })
        let verificationId = genRandomId()
        user = new userModel({
            username,
            password: pwHash,
            email,
            verificationId: verificationId
        })
        await user.save().then().catch()
        console.log("User created: " + JSON.stringify(user))
        await sendMail(username, email, verificationId, "verify")
        res.json({
            status: "OK",
            message: "Regisztráció sikeres! Küldtünk egy megerősítő emailt az Ön által megadott címre, csak megerősítés után tud majd bejelentkezni."
        }) 

})

router.post("/login", async function (req, res) {
    const username = req.body.usernameLogin
    const password = req.body.passwordLogin

    let user = await userModel.findOne({ username })
    if (user) {
        await bcrypt.compare(password, user.password).then(function (resolve, reject) {

            if (resolve) {
                req.session.user = {
                    username: username,
                    isVerified: user.isVerified
                }
                req.session.authenticated = true;
                console.log("Logged in user details from DB: " + JSON.stringify(req.session.user))
                res.redirect("/protected")
            }

            else {
                return res.json({
                    message: "Username or password invalid. " + JSON.stringify(req.body)
                })
            }
        })


    }
})

router.get('/signedup', function (req, res) {
    res.sendFile(pages.signedup)
})

router.post("/getmailtemplate", function (req, res) {
    res.json(
        { "Response": 666 }
    )

})



router.get('/verify', async function (req, res) {
    let id = req.query.id
    let user = await userModel.findOne({ verificationId: id }).catch((err) => {
        res.send("Not found")
    })
    if(!user) {
        res.send("This verification ID is no longer valid.")
    }
    else if (user) {
        user.updateOne({ "isVerified": true, "verificationId": "verified" }, function (err, result) {
            if (err) {
                console.log(err)
                return res.send("Error!: " + err)

            }
            console.log(result)

            user.save()
            res.send(user.username + " is verified!")
        })
    } else if (user.verificationId == "verified") {
        res.json({ message: "Error! This user is already verified." })
    }
    else res.json({ message: "Could not find user in the database." })
})

router.get('/logout', function (req, res) {
    if (req.session.user) {
        req.session.destroy();
        res.redirect("/");
    }
    else {
        res.json({ message: "Unable to log out. You are not logged in." })
    }
});


// FIND ADMIN IP TO GRANT ACCESS PERMISSION, OTHERWISE SHOW UNDERCONSTRUCTION


//   logger.myLogger(req, "Main page accessed", res.statusCode)

router.get("/", function (req, res) {
    if (!req.session.user) {
        res.sendFile(pages.app)
    } else if (req.session.user.isVerified) {
        res.sendFile(pages.protected)
    } else {
        res.sendFile(pages.app)
    }
})

router.get("/protected", checkAuthState, function (req, res) {
    console.log("*** Session username: " + JSON.stringify(req.session.user))
    if (req.session.user) {
        if (req.session.user.isVerified) {
            res.sendFile(pages.protected)

        } else {
            res.json({
                message: "This account is not yet verified."
            })
        }
    } else {
        res.redirect("/")
    }
})




router.use(function (req, res) {
    res.status(404).sendFile(path.resolve(pages.underCs));
});

router.use(function (err, req, res, next) {
    res.status(500).send('500: Internal Server Error ' + err);
});




module.exports = router;