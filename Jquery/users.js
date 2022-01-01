var express = require('express');
var router = express.Router();
var Post = require("../models/post");
var User = require("../models/user");

async function getAllPostsByUserId(id) {
  var posts = await Post.find({ author_id: id });
  // console.log(posts);
  return posts;
}

async function getUserById(id) {
  var user = await User.findOne({ _id: id });
  return user;
}


/* GET users listing. */
router.get('/:userId', isLoggedIn, async function (req, res, next) {
  var posts = await getAllPostsByUserId(req.params.userId);
  var allcomments = await getAllCommentsByUserId(req.params.userId);
  var user = await getUserById(req.params.userId);
  var flag = false;
  if (req.params.userId == req.user._id) {
    flag = true;
  }
  // console.log(allcomments);
  res.render('user', { user: req.user, visitinguser: user, posts: posts, allcomments: allcomments, flag });

});

router.get('/:userId/aboutme', async function (req, res, next) {
  var user = await getUserById(req.params.userId);
  res.render('aboutme', { name: 'Abdullah', user: user });
});

router.post('/aboutme', async function (req, res) {
  console.log(req.body.id);
  console.log(req.body.tagline);
  console.log(req.body.description);

  var user = await User.updateOne({ _id: req.body.id }, { $set: { 'tagline': req.body.tagline, 'description': req.body.description } });
  res.redirect("/users/" + req.body.id);
});

async function getAllCommentsByUserId(userId) {
  var allcomments = await Post.find({ 'comments.by': userId }, { comments: { $elemMatch: { by: userId } } });
  // console.log("Comments are: ", comments);
  // for (comments of allcomments) {
  //   for (comment of comments.comments) {
  //     console.log("Comment Id: ", comment._id)
  //     console.log("Comment Body: ", comment.body)
  //   }
  // }
  return allcomments;
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
