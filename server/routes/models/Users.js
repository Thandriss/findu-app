const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//model for saving information after registration or authentificated through the Passport.js
let users = new Schema({
    email: String,
    password: String,
    profile: String
});

module.exports = mongoose.model("Users", users);