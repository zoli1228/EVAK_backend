const mongoose = require('mongoose')


let Schema = mongoose.Schema

let materialSchema = new Schema({
    userid: Schema.Types.ObjectId,
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    tags: { type: Array },
    added_at: { type: String, required: true },
    added_by: { type: String, required: true }
});

module.exports = mongoose.model("materialslist", materialSchema)