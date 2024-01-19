var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/auth');
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
      maxAge: 1000 * 60 * 10
    },
  }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', usersRouter);

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

app.get('/my', (req, res) => {
    if (req.session.my === undefined) {
        req.session.my = 0;
    } else {
        req.session.my++;
    }
    console.log(req.session.my)
    return res.json(req.session)
})

app.listen(port, () => {
    console.log("Server listen!")
})

module.exports = app;
