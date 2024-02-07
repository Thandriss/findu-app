const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let profiles = new Schema({
    description: String,
    images: Array,
    date: String,
    name: String,
    gender: String,
    interest: String, 
    matched: Array,
    liked: Array,
    chats: Array
});

module.exports = mongoose.model("Profiles", profiles);