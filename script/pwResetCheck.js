//Format : Math.floor((Date.now() / 1000 / 3600 / 24 ))) 
const userModel = require('./userschema')
const myLogger = require('./logger')

async function pwResetCheck(req, res, next) {
    let username = req.body.username

    if (username) {
       let user = await userModel.findOne({ "username": username }, (err, doc) => {
            if (err) {
                myLogger("***HIBA: PW Reset Middleware: " + err)
                return
            }
        })

        if(user) {
            if(user.pwReset) {

                let debugDate = Math.floor((new Date(2021, 03, 20) / 1000 / 3600 / 24))
                let currentDate = Math.floor((Date.now() / 1000 / 3600 / 24))
                
                if ((currentDate - user.pwResetDateUnix) > 1) {
                    myLogger("PW Reset Middleware: Érvénytelen ideiglenes jelszó, ezt a jelszót " + (currentDate - user.pwResetDateUnix)) + " napja igényelték."
                    res.json({
                        status: "error",
                        message: "Ez a jelszó már lejárt. Igényeljen újat az elfelejtett jelszó használatával!"
                    })
                    return
                }
                else {
                    myLogger("PW Reset Middleware: Ideiglenes jelszó érvényes, tovább...")
                    req.session.pwReset = true;
                    next()
                }
            }
            else {
                next()
            }
        }
        else {
            next()
        }
    }
}

module.exports = pwResetCheck