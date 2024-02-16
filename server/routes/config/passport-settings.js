const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const Users = require("../models/Users");
const Profiles = require("../models/Profiles");
var moment = require('moment');


//The Google OAuth 2.0 authentication strategy authenticates users using a Google account and OAuth 2.0 tokens.
//The strategy requires a verify callback, which accepts these credentials and calls done providing a user,
//as well as options specifying a client ID, client secret (this information can be changed in file keys.js), and callback URL.
passport.use(
    new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect', // more detailed path in auth.js
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'

    }, async (accessToken, refreshToken, profile, done) => {
        console.log("here")
        Users.findOne({email: profile._json.email})
        .then(async (user)=> {
        console.log(user)
        if(!user) {
            //if user was not registered on this resource
            //create the new record in user model and profile
            var date = moment();
            var currentDate = date.format('D/MM/YYYY');
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
                new Users({
                    email: profile._json.email,
                    password: "",
                    profile: newProf._id.toString()
                }).save()
                newProf.save()
        } else {
            //if user was registered on this resource
            done(null, user)
        }
    })
    })
)

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user)
});