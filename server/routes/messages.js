var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const Profiles = require("./models/Profiles");
const Img = require("./models/Images");
const session = require('express-session');
const Chats = require("./models/Chat");
const { createServer } = require('node:http');
const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB);
console.log(mongoose.connection.readyState);
console.log("CONNECT");
mongoose.Promise = Promise;
const db = mongoose.connection;
var moment = require('moment');
db.on("error", console.error.bind(console, "MongoDB connection error"));
const server = createServer(router);
router.use(bodyParser.json()) ;
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/send/:chatId', (req,res) => {
    let chat = req.params.chatId;
    let {messages} = req.body
    console.log(messages)
    Chats.findById(chat)
    .then((allMess) =>{
        let curChat = allMess.messages;
        console.log(curChat)
        let date = moment();
        let currentDate = date.format('D/MM/YYYY hh:mm:ss.ms');
        Profiles.findById({_id: req.session.user.profile})
        .then(async (user) => {
            let toSend = {
                text: messages,
                date: currentDate,
                name: user.name
            }
            console.log(toSend)
            curChat.push(toSend)
            console.log(curChat)
            await Chats.updateOne({_id: chat}, { messages: curChat});
            res.send({messages: curChat})
        })
    })
});


router.get('/all/:chatId', (req, res) => {
    let chat = req.params.chatId;
    Chats.findById(chat)
    .then((allMess) =>{
        res.send({messages: allMess.messages});
    })
})

module.exports = router;