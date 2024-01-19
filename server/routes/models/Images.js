const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let image = new Schema({
    name: String,
    buffer: Buffer,
    mimetype: String,
    encoding: String
});

module.exports = mongoose.model("Images", image);