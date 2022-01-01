var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var User = require("./models/user");
var session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var timelineRouter = require('./routes/timeline');
var createpostRouter = require('./routes/post');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require("express-session")({
    secret: "Hello my name is abdullah",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/connect", { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/timeline', timelineRouter);
app.use('/users', usersRouter);
app.use('/post', createpostRouter);

module.exports = app;
