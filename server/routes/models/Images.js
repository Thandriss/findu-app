const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// model for images
let image = new Schema({
    name: String,
    buffer: Buffer,
    mimetype: String,
    encoding: String
});

module.exports = mongoose.model("Images", image);