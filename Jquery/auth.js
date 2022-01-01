var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.post('/signup', function (req, res, next) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        mobile: req.body.mobile
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.send("Error Occured");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/timeline",
    failureRedirect: "/login"
}), function (req, res) {
});

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
});

module.exports = router;
