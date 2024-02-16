const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// model, having all information about profile
let profiles = new Schema({
    description: String,
    images: Array,
    date: String,
    name: String,
    gender: String,
    interest: String, 
    matched: Array,
    liked: Array,
    disliked: Array,
    chats: Array
});

module.exports = mongoose.model("Profiles", profiles);