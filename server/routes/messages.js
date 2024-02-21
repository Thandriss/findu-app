var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const Profiles = require("./models/Profiles");
const Messages = require("./models/Messages");
const Chats = require("./models/Chat");
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

//send message to db
router.post('/send/:chatId', (req,res) => {
    let chat = req.params.chatId;
    let {messages} = req.body
    Chats.findById(chat)
    .then((allMess) =>{
        let curChat = allMess.messages;
        let messagesAr = [];
        let date = moment();//form date to savre in Message collection
        let currentDate = date.format('D/MM/YYYY hh:mm:ss.ms');
        Profiles.findById({_id: req.session.user.profile})
        .then(async (user) => {
            let newMess = new Messages({ //form the document
                text: messages,
                date: currentDate,
                sender: req.session.user.profile
            });
            curChat.push(newMess._id.toString()) // for update of messages in chat
            newMess.save();
            await Chats.updateOne({_id: chat}, { messages: curChat});
            let chatArray = await Chats.findById(chat)
            for (let i=0; i<chatArray.messages.length; i++) { // get all messages from chat to send
                let message = await Messages.findById(chatArray.messages[i])
                let sender = await Profiles.findById(message.sender)
                let save = {
                    _id: message._id,
                    text: message.text,
                    date: message.date,
                    name: sender.name
                }
                messagesAr.push(save) 
            }
            return res.send({messages: messagesAr})
        })
    })
});

// route for editing the chat 
router.post('/edit/:messId', async (req,res) => {
    try {
        let messId = req.params.messId;
        let {messages, chatId} = req.body
        let messagesAr = [];
        Profiles.findById({_id: req.session.user.profile})
        .then(async (user) => {
            Messages.findById(messId)
            .then(async (oneMess) =>{
                let date = moment();
                let currentDate = date.format('D/MM/YYYY hh:mm:ss.ms');//change the date of message 
                let sender = await Profiles.findById({_id: oneMess.sender})
                if (user.name === sender.name) { //check user change own message
                    await Messages.updateOne({_id: messId}, { text: messages, date: currentDate});
                    let chatArray = await Chats.findById(chatId)
                    for (let i=0; i<chatArray.messages.length; i++) { //return all messages from chat
                        let message = await Messages.findById(chatArray.messages[i])
                        let sender = await Profiles.findById(message.sender)
                        let save = {
                            _id: message._id,
                            text: message.text,
                            date: message.date,
                            name: sender.name
                        }
                        messagesAr.push(save)
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

//getting all messages
router.get('/all/:chatId', async (req, res) => {
    let chat = req.params.chatId;
    let chatArray = await Chats.findById(chat)
    let messagesAr = [];
    for (let i=0; i<chatArray.messages.length; i++) {
        let message = await Messages.findById(chatArray.messages[i])
        let sender = await Profiles.findById(message.sender)
        let save = {
            _id: message._id,
            text: message.text,
            date: message.date,
            name: sender.name
        }
        messagesAr.push(save)
    }
    res.send({messages: messagesAr})
})

module.exports = router;