const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// model for chat
// in messages array are json, which have sender id, timestamp and text
let message = new Schema({
    text: String,
    date: String,
    sender: String
});

module.exports = mongoose.model("Messages", message);