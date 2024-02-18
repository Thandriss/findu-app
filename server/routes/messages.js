var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const Profiles = require("./models/Profiles");
const Messages = require("./models/Messages");
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
router.use(bodyParser.json()) ;
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/send/:chatId', (req,res) => {
    let chat = req.params.chatId;
    let {messages} = req.body
    console.log(messages)
    Chats.findById(chat)
    .then((allMess) =>{
        let curChat = allMess.messages;
        let messagesAr = [];
        let date = moment();
        let currentDate = date.format('D/MM/YYYY hh:mm:ss.ms');
        Profiles.findById({_id: req.session.user.profile})
        .then(async (user) => {
            let newMess = new Messages({
                text: messages,
                date: currentDate,
                name: user.name
            });
            curChat.push(newMess._id.toString())
            newMess.save();
            await Chats.updateOne({_id: chat}, { messages: curChat});
            let chatArray = await Chats.findById(chat)
            console.log(chatArray)
            for (let i=0; i<chatArray.messages.length; i++) {
                let message = await Messages.findById(chatArray.messages[i])
                console.log(message)
                messagesAr.push(message)
            }
            return res.send({messages: messagesAr})
        })
    })
});

router.post('/edit/:messId', async (req,res) => {
    try {
        let messId = req.params.messId;
        let {messages, chatId} = req.body
        let messagesAr = [];
        console.log(messages)
        Profiles.findById({_id: req.session.user.profile})
        .then(async (user) => {
            Messages.findById(messId)
            .then(async (oneMess) =>{
                console.log(oneMess)
                let date = moment();
                let currentDate = date.format('D/MM/YYYY hh:mm:ss.ms');
                if (user.name === oneMess.name) {
                    await Messages.updateOne({_id: messId}, { text: messages, date: currentDate});
                    let chatArray = await Chats.findById(chatId)
                    console.log(chatArray)
                    for (let i=0; i<chatArray.messages.length; i++) {
                        let message = await Messages.findById(chatArray.messages[i])
                        messagesAr.push(message)
                    }
                    return res.send({messages: messagesAr})
                } else {
                    return res.send({message: "not allowed to change"})
                }
            })
        })
    } catch(err) {
        return res.send({message: "not allowed to change"})
    }
});


router.get('/all/:chatId', async (req, res) => {
    let chat = req.params.chatId;
    let chatArray = await Chats.findById(chat)
    console.log(chatArray)
    let messagesAr = [];
    console.log(chatArray.messages.length)
    for (let i=0; i<chatArray.messages.length; i++) {
        let message = await Messages.findById(chatArray.messages[i])
        console.log(message)
        messagesAr.push(message)
    }
    res.send({messages: messagesAr})
})

module.exports = router;