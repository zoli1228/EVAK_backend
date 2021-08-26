const mongoose = require('mongoose')

let Schema = mongoose.Schema

let workSchema = new Schema({
    work_id: Schema.Types.ObjectId,
    added_by: { type: String, required: true},
    category: { type: String, required: true },
    worktitle: { type: String, required: true },
    workprice: { type: Number, required: true },
    uniqueId: { type: String, required: true, unique: true }
    
});

module.exports = mongoose.model("worklist", workSchema)