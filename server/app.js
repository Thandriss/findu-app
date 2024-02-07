var express = require('express');
var path = require('path');
const bodyParser = require('body-parser')
const passport = require('passport');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var dataRouter = require('./routes/save');
var usersRouter = require('./routes/users');
const session = require('express-session');
var cors = require('cors')
const { createClient } = require("redis");
const connectRedis = require('connect-redis');
const port  = 1235
const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch((e)=> console.log("no connection"))
const RedisStore = connectRedis(session);
const app = express();
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

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/data', dataRouter);
app.use('/users', usersRouter);

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

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

app.listen(port, () => {
    console.log("Server listen!")
})

module.exports = app;
