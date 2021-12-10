const mongoose = require('mongoose')

let Schema = mongoose.Schema

let quoteSchema = new Schema({
    quote_id: Schema.Types.ObjectId,
    username: { type: String, required: true },
    timestamp: { type: String, required: true },
    createdAt: { type: String, required: true },
    modifiedAt: { type: String, required: true },
    clientname: { type: String, required: true },
    clientaddress: { type: String, required: true },
    contract_type: { type: Number, required: true },
    serialnumber: { type: String, required: true, unique: true },
    worklist: { type: Object, required: true },
    materiallist: { type: Object, required: true },
    netPrice: { type: String, required: true },
    discount: { type: Number, required: true },
    discountValue: { type: Number, required: true },
    valueAfterDiscount: { type: Number, required: true },
    taxCode: { type: String, required: true },
    taxAmount: { type: Number, required: true },
    grossTotal: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    globalMatMultiplier: { type: Number, required: true },
    globalNormPrice: { type: Number, required: true },
    status: { type: String, required: true, default: "unsent" }

});

module.exports = mongoose.model("Quotes", quoteSchema)