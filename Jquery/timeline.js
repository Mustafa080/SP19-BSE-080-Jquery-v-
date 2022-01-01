var express = require('express');
var router = express.Router();
var Post = require("../models/post");


async function getAllPosts() {
    var posts = await Post.find();
    // console.log(posts);
    return posts;
}

async function getPostByCategory(query) {
    var posts = await Post.find({ category: query });
    return posts;
}

router.post('/search', isLoggedIn, async function (req, res) {
    var posts = await getPostByCategory(req.body.query);
    res.render("timeline", { user: req.user, posts: posts });
});

router.get('/', isLoggedIn, async function (req, res) {
    var posts = await getAllPosts();
    res.render("timeline", { user: req.user, posts: posts });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;