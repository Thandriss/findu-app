var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authRouter = require('./routes/auth');
var dataRouter = require('./routes/save');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');
const session = require('express-session');
var cors = require('cors')

//connection of the redis
const { createClient } = require("redis");
const connectRedis = require('connect-redis');
const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch((e)=> console.log("no connection"))
const RedisStore = connectRedis(session);
const app = express();

//Redis session for security
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24
    },
  }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/auth', authRouter); //path for authentification
app.use('/data', dataRouter); //path for getting user's data
app.use('/users', usersRouter); //path for getting data connected with like/dislike and match
app.use('/mess', messagesRouter); //path for messages

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("..", "client", "build")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve("..", "client", "build", "index.html"))
    })
} else if(process.env.NODE_ENV === "development") {
    var corsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
}
app.use(cors({origin: "http://localhost:3000", optionsSuccessStatus: 200}))


module.exports = app;
