const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let profiles = new Schema({
    description: String,
    images: Array,
    name: String,
    surename: String,
    age: Number
});

module.exports = mongoose.model("Profiles", profiles);