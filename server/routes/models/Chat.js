const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// model for chat
// in messages array are json, which have name of user, who sended the message, timestamp and text
let chats = new Schema({
    messages: Array
});

module.exports = mongoose.model("Chats", chats);