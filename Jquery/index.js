var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();

/* GET home page. */
router.get("/", isLoggedIn, function (req, res) {
  res.redirect("/timeline");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render("index", { user: null });
}

router.get('/login', function (req, res, next) {
  res.render('login', { user: null });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { user: null });
});

router.get('/contact', function (req, res, next) {
  res.render('contactus');
});

module.exports = router;
