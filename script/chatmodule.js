const mongoose = require('mongoose')
const timestamp = require("./timestamp.js")

let Schema = mongoose.Schema

let chatSchema = new Schema({
    chatid: Schema.Types.ObjectId,
    username: { type: String, required: true},
    timestamp: { type: String, required: true},
    message: { type: String },
    colour: { type: Object, default: {
        R: "0",
        G: "0",
        B: "0"
    }}
});

module.exports = mongoose.model("Chat", chatSchema)