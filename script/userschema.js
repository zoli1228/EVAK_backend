const mongoose = require('mongoose')
const timestamp = require("./timestamp.js")

let Schema = mongoose.Schema

let userSchema = new Schema({
    userid: Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: String, default: timestamp() },
    isLoggedIn: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    pwReset: { type: Boolean, default: false },
    pwResetDateUnix: { type: String, default: (Math.floor((Date.now() / 1000 / 3600 / 24))) },
    verificationId: {type: String},
    lastLogin: {type: String, default: timestamp("precision") }
});

module.exports = mongoose.model("User", userSchema)