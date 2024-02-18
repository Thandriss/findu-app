const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// model for chat
// in messages array are json, which have name of user, who sended the message, timestamp and text
let message = new Schema({
    text: String,
    date: String,
    name: String
});

module.exports = mongoose.model("Messages", message);