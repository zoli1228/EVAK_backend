const mongoose = require('mongoose')

let Schema = mongoose.Schema

let quoteSchema = new Schema({
    quote_id: Schema.Types.ObjectId,
    username: { type: String, required: true},
    timestamp: { type: String, required: true},
    createdAt: { type: String, required: true},
    clientname: { type: String, required: true },
    clientaddress: { type: String, required: true},
    worktype: { type: String, required: true},
    serial: { type: String, required: true},
    worklist: { type: Object, required: true },
    materiallist: { type: Object, required: true }
    
});

module.exports = mongoose.model("Quotes", quoteSchema)