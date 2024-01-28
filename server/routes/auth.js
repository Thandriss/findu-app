var express = require('express');
var router = express.Router();
const {body, validationResult } = require("express-validator");
const bodyParser = require('body-parser')
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
            let newProf =new Profiles({
                name: "",
                surename: "",
                description: "",
                images: [],
                age: 0
            })
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
                    console.log("registered")
                })
            })
        } else {
            res.status(403).send({email: "Email already in use"})
        }
    })
})


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
            console.log(req.session)
            // res.json({
            //     user: sessionUser,
            // });
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err
                if(isMatch) {
                // const sessionId = uuidv4();
                // res.cookie('connect.sid', sessionId)
                // saveToken.add(token);
                // passport.authenticate('local')
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