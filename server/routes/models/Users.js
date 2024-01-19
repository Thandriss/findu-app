const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let users = new Schema({
    email: String,
    password: String,
    profile: String
});

module.exports = mongoose.model("Users", users);