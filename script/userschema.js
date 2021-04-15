const mongoose = require('mongoose')

let Schema = mongoose.Schema

let userSchema = new Schema({
    userid: Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    updatedAt: ({ type: Date, default: Date.now() }),
    isLoggedIn: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationId: {type: String}
});

module.exports = mongoose.model("User", userSchema)