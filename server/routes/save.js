var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const Profiles = require("./models/Profiles");
const Img = require("./models/Images");
const session = require('express-session');
const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/testdb"
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
mongoose.connect(mongoDB);
console.log(mongoose.connection.readyState);
console.log("CONNECT");
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

router.use(bodyParser.json()) ;
router.use(bodyParser.urlencoded({ extended: true }));

router.use(express.json({
    type: ['application/json', 'text/plain']
  }))


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

router.get("/userProf", (req, res) => {
    Profiles.findById({_id: req.session.user.profile})
    .then((user) => {
        return res.status(200).send({user})
    })
});

router.get("/images/:imageId", (req, res) => {
    Img.findById(req.params.imageId)
    .then((result) => {
        res.setHeader("Content-Disposition", "inline" + ";" + 'filename=' + result.name);
        res.setHeader("Content-Type", result.mimetype);
        return res.send(result.buffer);
    })
});

router.get("/interest", (req, res) => {
    console.log(req.session)
    Profiles.findById({_id: req.session.user.profile})
    .then((user) => {
        return res.status(200).send({interest: user.interest})
    })
});


router.get("/userImgs", (req, res) => {
    let saves = []
    Profiles.findById({_id: req.session.user.profile})
    .then(async (user) => {
        console.log(user.images.length)
        for(let i= 0; i < user.images.length; i++) {
           let result = await Img.findById(user.images[i])
           saves.push(result.buffer)
        }
        res.status(200).send({info: saves})
    })
});

router.get("/delImgs", (req, res) => {
    let saves = []
    Profiles.findById({_id: req.session.user.profile})
    .then(async (user) => {
        console.log(user.images.length)
        for(let i= 0; i < user.images.length; i++) {
           let result = await Img.deleteOne({_id: user.images[i]})
           saves.push(result.buffer)
        }
        res.status(200).send({info: saves})
    })
});

router.post("/profData", (req, res) => {
    const {id, date, name, description, gender, interest} = req.body;
    Profiles.findById({_id: req.session.user.profile})
    .then(async (user) => {
        await Profiles.updateOne({_id: req.session.user.profile}, { date: date, name: name, images: id, description: description, gender: gender, interest: interest});
    })
    res.status(200).send("Iana")
});

module.exports = router;