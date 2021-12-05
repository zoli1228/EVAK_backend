const router = require("express").Router()
const genRandomId = require("../genRandomId")
const genRandomRGB = require("../genRandomRGB")
const auth = require("../checkAuthState")
const chatModel = require("../chatmodule")
const timestamp = require("../timestamp")
const myLogger = require("../logger")

let escapeRegex = (string) => {
    string = string.replace(/[.*^${}<>|[\]\\]/g, "");
    string = string.replace(/(<([^>]+)>)/ig, "")
    return string
}

let swapEmoji = (input) => {
    input = input.replace(":)", "🙂")
    input = input.replace(":D", "😃")
    input = input.replace(":|", "😐")
    input = input.replace(":(", "☹️")
    input = input.replace(":'D", "😂")
    input = input.replace("XD", "🤣")
    input = input.replace(":P", "😜")
    input = input.replace(":'('", "😢")
    input = input.replace(":O", "😲")
    input = input.replace(":@", "🤬")
    input = input.replace(":*", "😙")
    input = input.replace("B-)", "😎")
    input = input.replace(":$", "🤢")
    input = input.replace("<3", "❤️")
    return input
}

router
.post("/messages", auth, async (req, res) => {
    try {
        let user = req.session.user.username
        let message = req.body.message.toString()
        message = swapEmoji(message)
        message = escapeRegex(message)

        if (message.includes("{{{username}}}")) {
            user = genRandomId(Math.round(Math.random() * (10 - 5) + 5))
            message = message.replace("{{{username}}}", "")
        }
        if (!message.trim().length) {
            return
        }
        let existing = await chatModel.findOne({ username: user })
        .catch(error => {
            return res.status(503).json({message : "Hiba" + error})
        })
        let chat;
        let time = timestamp()
        let createdAt = timestamp("precision")
        if (message.length > 500) {
            return res.end("Maximum 500 karakter engedélyezett.")
        }
        if (existing) {
            chat = new chatModel({
                username: user,
                message: message,
                colour: existing.colour,
                timestamp: time,
                createdAt: createdAt
            })

        }
        else {
            chat = new chatModel({
                username: user,
                message: message,
                colour: genRandomRGB(),
                timestamp: time,
                createdAt: createdAt
            })
        }
        if (chat) {
            chat.save().then((resolve, reject) => {
                if (resolve) return
                myLogger("Chat mentési hiba: " + reject)
            })
        }

        res.status(200).end("OK")


    } catch (err) {
        console.log(err)
        res.status(500).end()
    }
})
.get("/messages", auth, async (req, res) => {


    await chatModel.find({}).sort({ "createdAt": -1 }).limit(100).then(resolved => {

        if (!resolved.length) {
            res.json([{
                username: "Rendszerüzenet",
                message: swapEmoji("Sajnos a chat fal üres. :( Szólj hozzá! B-)"),
                timestamp: "",
                colour: {
                    "R": 255,
                    "G": 255,
                    "B": 255
                }
            }])
            return
        }

        res.status(200).json(resolved)
    }).catch((err) => {
 
        res.json({
            username: "Rendszerüzenet",
            message: "Unable to find messages",
            timestamp: "",
            colour: {
                "R": 255,
                "G": 255,
                "B": 255
            }
        })
    })

})

module.exports = router