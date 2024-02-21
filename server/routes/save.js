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
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

router.use(bodyParser.json()) ;
router.use(bodyParser.urlencoded({ extended: true }));

router.use(express.json({
    type: ['application/json', 'text/plain']
  }))

//save image in db
router.post("/images", upload.array("images"), async (req, res) => {
    try {
        let idSave = [];
        let flag = false;
        for (let i=0; i<req.files.length; i++) {
            await Img.findOne({name: req.files[i].originalname})
            .then((name) => {
                console.log("here")
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
                    flag = true
                }
            }) 
            if (flag) {
                break
            }
        }
        if (flag) {
            return res.send({messages: "Have this image"});
        } else {
            console.log("here")
            let result = {id: idSave};
            return res.send(result);
        }
    } catch(err) {
        res.send({messages: "Have this image"});
    }
});

//get the information about profile
router.get("/userProf", (req, res) => {
    Profiles.findById({_id: req.session.user.profile})
    .then((user) => {
        return res.status(200).send({user})
    })
});

//get the information about profile of another user
router.get("/userProf/:id", (req, res) => {
    Profiles.findById({_id: req.params.id})
    .then((user) => {
        return res.status(200).send({user})
    })
});

//get one image from db
router.get("/images/:imageId", (req, res) => {
    Img.findById(req.params.imageId)
    .then((result) => {
        res.setHeader("Content-Disposition", "inline" + ";" + 'filename=' + result.name);
        res.setHeader("Content-Type", result.mimetype);
        return res.send(result.buffer);
    })
});

//get interest of the user
router.get("/interest", (req, res) => {
    Profiles.findById({_id: req.session.user.profile})
    .then((user) => {
        return res.status(200).send({interest: user.interest})
    })
});

//get all user's images
router.get("/userImgs", (req, res) => {
    let saves = []
    Profiles.findById({_id: req.session.user.profile})
    .then(async (user) => {
        for(let i= 0; i < user.images.length; i++) {
           let result = await Img.findById(user.images[i])
           saves.push(result.buffer)
        }
        res.status(200).send({info: saves})
    })
});

//delete images, if user edit the profile
router.get("/delImgs", (req, res) => {
    let saves = []
    Profiles.findById({_id: req.session.user.profile})
    .then(async (user) => {
        for(let i= 0; i < user.images.length; i++) {
           let result = await Img.deleteOne({_id: user.images[i]})
           saves.push(result.buffer)
        }
        res.status(200).send({info: saves})
    })
});

//update profile information
router.post("/profData", (req, res) => {
    const {id, date, name, description, gender, interest} = req.body;
    Profiles.findById({_id: req.session.user.profile})
    .then(async (user) => {
        await Profiles.updateOne({_id: req.session.user.profile}, { date: date, name: name, images: id, description: description, gender: gender, interest: interest});
    })
});

module.exports = router;