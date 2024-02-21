var express = require('express');
var router = express.Router();
const Profiles = require("./models/Profiles");
const Chats = require("./models/Chat");
const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB);
console.log(mongoose.connection.readyState);
console.log("CONNECT");
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

//path to get the list of all users, which are interest of the current user
router.get('/toswipe/:int', (req, res) => {
  try {
    const genderInt = req.params.int
    Profiles.find({gender: genderInt})
    .then((users) => {
      Profiles.findById(req.session.user.profile)
      .then((user) => {
            let save = users
            let listLiked = user.liked;
            let listDislike = user.disliked
            let final = []
            for (let i=0; i<save.length; i++) {
              //user can not swipe himself and swipe the same people, who were swioed already
              if (save[i]._id != req.session.user.profile && !listLiked.includes(save[i]._id) && !listDislike.includes(save[i]._id)) {
                final.push(save[i])
              }
            }
          return res.status(200).send({data: final})
        })
    })
  } catch(err) {
    return res.send({message: "no interest"})
  }
});

//path to get names with matched users and chats ids
router.get('/matches', (req, res) => {
  try {
    const prof = req.session.user.profile
    Profiles.findById(prof)
    .then(async (users) => {
        let save = users.matched
        let list = []
        for (let i=0; i<save.length; i++) {
          let user = await Profiles.findById(save[i])
          list.push({id: user._id, name: user.name, chatId: users.chats[i]})
        }
        return res.status(200).send({data: list})
    })
  } catch(err) {
    return res.send({message: "no matches"})
  }
});

//when the user swip on the right it is fetched to input in the list from db the id of liked user
//or add in the list of matches if it is
router.post('/like/:id', (req, res) => {
  try {
    const userId = req.params.id
  const own = req.session.user.profile
  Profiles.findById(own)
  .then(async (users) => {
        Profiles.findById(userId)
        .then(async (intUser) => {
          let isMatched = false;
          for (let i=0; i< intUser.liked.length; i++) {
            //in case of match 
            if (intUser.liked[i] === own) {
              let newchat =new Chats({
                matched: []
              })
              isMatched = true
              // list of chats and matches have to be updated
              let curChats = intUser.chats;
              curChats.push(newchat._id.toString())
              let currMatch = intUser.matched;
              currMatch.push(own);
              await Profiles.updateOne({_id: userId}, {matched: currMatch, chats: curChats});
              currMatch = users.matched
              currMatch.push(userId);
              let liked = users.liked
              let chats = users.chats;
              chats.push(newchat._id.toString())
              liked.push(userId)
              newchat.save()
              await Profiles.updateOne({_id: own}, {matched: currMatch, liked: liked, chats: chats});
              return res.send({message: "is matched", id: newchat._id.toString()})
            }
          }
          // if it is just a match
          if (!isMatched) {
            let liked = users.liked
            liked.push(userId)
            await Profiles.updateOne({_id: own}, {liked: liked});
            return res.send({message: "is liked"})
          }
        })
    })
  } catch(err) {
    return res.send({message: "no liked"})
  }
});

//make a dislike, when user swiped on the left
router.post('/dislike/:id', (req, res) => {
  try {
    const userId = req.params.id
    const own = req.session.user.profile
    Profiles.findById(own)
    .then(async (users) => {
      Profiles.findById(userId)
      .then(async (intUser) => {
          //list of disliked users have to be updated
          let disliked = users.disliked
          disliked.push(userId)
          await Profiles.updateOne({_id: own}, {disliked: disliked});
          return res.send({message: "is disliked"})
        })
    })
  } catch(err) {
    return res.send({message: "no liked"})
  }
});


module.exports = router;
