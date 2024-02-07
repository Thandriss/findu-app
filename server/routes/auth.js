var express = require('express');
var router = express.Router();
const {body, validationResult } = require("express-validator");
const bodyParser = require('body-parser');
const passport = require('passport');
var moment = require('moment');
const passSet = require('./config/passport-settings')
const Users = require("./models/Users");
const Profiles = require("./models/Profiles");
const session = require('express-session');
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/testdb"
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
mongoose.connect(mongoDB);
console.log(mongoose.connection.readyState);
console.log("CONNECT");
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));




router.post("/register",
isNotAuth,  
body("email").trim().escape(),
body("email").isEmail(),
body("password").isLength({min: 8}),
body("password").matches('[0-9]').withMessage('Password Must Contain a Number'),
body("password").matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter'),
body("password").matches('[a-z]').withMessage('Password Must Contain an Lowercase Letter'),
body("password").matches('[~`!@#$%^&*()-_+={}[]|\;:"<>,./?]'),
async (req , res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }  
    const {email, password} = req.body;
    Users.findOne({email: email})
    .then(async (user)=> {
        console.log(user)
        if(!user) {
            let date = moment();
            let currentDate = date.format('D/MM/YYYY');
            console.log(currentDate)
            let newProf =new Profiles({
                name: "",
                date: currentDate,
                description: "",
                images: [],
                gender: "",
                interest: "",
                liked: [],
                matched: []
            })
            console.log(newProf)
            console.log(newProf._id.toString())

            let new_pass 
            await bcrypt
            .genSalt(10)
            .then(salt => {
                bcrypt.hash(password, salt)
                .then((result) => {
                    new_pass = result
                    new Users({
                        email: email,
                        password: new_pass,
                        profile: newProf._id.toString()
                    }).save()
                    newProf.save()
                    res.status(200).send({status: "ok"})
                })
            })
        } else {
            res.status(403).send({email: "Email already in use"})
        }
    })
})

router.get('/google', passport.authenticate('google',{ 
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

router.get("/google/redirect", 
 passport.authenticate("google"), 
 (req, res) => {
    console.log('session')
    console.log(req.session)
    console.log('end session')
    req.session.user = {
        _id: req.session.passport.user._id,
        email: req.session.passport.user.email,
        password: req.session.passport.user.password,
        profile: req.session.passport.user.profile.toString()
    };
    console.log(req.session.user)
    console.log("/google/redirect")
    res.redirect(`http://localhost:3000/cards`);
});

router.get('/logout', function(req,res){
    res.clearCookie('connect.sid');
    req.session.destroy(function (err) {
           res.redirect('http://localhost:3000/');
       });
   });

function isNotAuth(req, res, next) {
    if (req.session.user) return res.redirect("/")
    next();
}

router.post("/login",
isNotAuth,
body("email").trim().escape(),
async (req, res) => {
    const {email, password} = req.body;
    req.session.email = email
    Users.findOne({email: email})
    .then ((user) => {
        if(user) {
            const sessionUser = {
                ...user.toJSON(),
            };
            delete sessionUser.password;
            req.session.user = sessionUser;
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err
                if(isMatch) {
                res.send({"success": true, "user": sessionUser})
            } else {
                res.send({"success": false, "message": "Invalid credentials"})
            }
        })
        } else {
            res.send({"success": false, "message": "Invalid credentials"})
        }
    })
})

router.post("/images", upload.array("images"), async (req, res) => {
    let idSave = [];
    for (let i=0; i<req.files.length; i++) {
        await Img.findOne({name: req.files[i].originalname})
        .then((name) => {
            if(!name) {
                let newImg = new Img({
                    name: req.files[i].originalname,
                    buffer: req.files[i].buffer,
                    mimetype: req.files[i].mimetype,
                    encoding: req.files[i].encoding
                });
                idSave.push(newImg._id.toString());
                newImg.save();
            } else {
                return res.status(403).send("Have this image");
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    let result = {"id": idSave};
    return res.send(result);
});


module.exports = router;