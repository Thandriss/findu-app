var express = require('express');
var router = express.Router();
const {body, validationResult } = require("express-validator");
const passport = require('passport');
var moment = require('moment');
const passSet = require('./config/passport-settings')
const Users = require("./models/Users");
const Profiles = require("./models/Profiles");
const session = require('express-session');
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

//route for registration
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
        return res.send({errors: errors.array()});
    }  
    const {email, password} = req.body;
    Users.findOne({email: email})
    .then(async (user)=> {
        console.log(user)
        if(!user) {
            let date = moment();
            let currentDate = date.format('D/MM/YYYY');
            let newProf =new Profiles({// creation the new profile
                name: "",
                date: currentDate,
                description: "",
                images: [],
                gender: "",
                interest: "",
                liked: [],
                matched: []
            })
            let new_pass 
            await bcrypt
            .genSalt(10)
            .then(salt => {
                bcrypt.hash(password, salt)
                .then((result) => {
                    new_pass = result
                    new Users({ //creation of the user in 
                        email: email,
                        password: new_pass,
                        profile: newProf._id.toString()
                    }).save()
                    newProf.save()//save profile
                    return res.status(200).send({status: "ok"})
                })
            })
        } else {
            return res.status(403).send({message: "Email already in use"})
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

//router for logout
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
    try {
        const {email, password} = req.body;
        Users.findOne({email: email})
        .then ((user) => {
            if(user) {
                req.session.email = email
                console.log("here")
                const sessionUser = {
                    ...user.toJSON(),
                };
                delete sessionUser.password;
                req.session.user = sessionUser;
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err
                    if(isMatch) {
                    res.send({success: true, user: sessionUser})
                } else {
                    res.send({success: false, message: "Invalid credentials"})
                }
            })
            } else {
                return res.status(403).send({success: false, message: "Invalid credentials"})
            }
        })
    } catch(err) {
        console.log(err)
    }
})


module.exports = router;