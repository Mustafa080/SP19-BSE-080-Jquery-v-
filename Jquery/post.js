var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();
var Post = require("../models/post");

async function getPost(id) {
    var posts = await Post.findById(id);
    return posts;
}

async function getAllBlogPosts() {
    var posts = await Post.find({ category: 'blog' });
    return posts;
}

async function getAllImagePosts() {
    var posts = await Post.find({ category: 'img' });
    return posts;
}

router.get('/images', isLoggedIn, async function (req, res) {
    var posts = await getAllImagePosts();
    res.render('imagegallery', { user: req.user, posts: posts });
});

router.get('/image/create', isLoggedIn, function (req, res) {
    res.render('createimagepost', { post: null });
});

router.post("/image/create", async function (req, res) {
    var post = new Post({
        title: req.body.title,
        link: req.body.link,
        category: 'img',
        author_id: req.user._id,
        author: req.user.username
    });
    var post = await post.save();
    res.redirect("/post/image/" + post._id);
});

router.get('/image/:id', isLoggedIn, async function (req, res) {
    var post = await getPost(req.params.id);
    res.render("image", { user: req.user, post, comment: null });
});

router.post('/image/updatepost', isLoggedIn, async function (req, res) {
    var post = await Post.findOneAndUpdate({ _id: req.body.id }, { $set: { title: req.body.title, link: req.body.link } });
    res.redirect("/post/image/" + req.body.id);
});

router.get('/image/:id/update', isLoggedIn, async function (req, res) {
    var post = await getPost(req.params.id);
    res.render("createimagepost", { user: req.user, post });
});

router.post('/image/addcomment', isLoggedIn, async function (req, res) {
    var comment = { body: req.body.comment, by: req.user._id, author: req.user.username, category: 'img' };
    var post = await Post.findOneAndUpdate({ _id: req.body.id }, { $push: { comments: comment } });
    res.redirect("/post/image/" + req.body.id);
});

router.get('/image/:postId/comments/:commentId/update', isLoggedIn, async function (req, res) {
    var post = await getPost(req.params.postId);
    var reqComment;
    for (comment of post.comments) {
        if (comment._id == req.params.commentId) {
            reqComment = comment;
            break;
        }
    }
    res.render("image", { user: req.user, post, comment: reqComment });
});

router.post('/image/comments/update', isLoggedIn, async function (req, res) {

    await Post.updateOne(
        { _id: req.body.postId, 'comments._id': req.body.commentId },
        { $set: { 'comments.$.body': req.body.comment } }
    );

    res.redirect("/post/image/" + req.body.postId);
});


router.get('/blogs', isLoggedIn, async function (req, res) {
    var posts = await getAllBlogPosts();
    res.render('blogs', { user: req.user, posts: posts });
});

router.get('/blog/create', isLoggedIn, function (req, res) {
    res.render('editor', { post: null });
});

router.post("/blog/create", isLoggedIn, async function (req, res) {
    var post = new Post({
        title: req.body.title,
        body: req.body.body,
        category: 'blog',
        author_id: req.user._id,
        author: req.user.username
    });
    var post = await post.save()
    res.redirect("/post/blog/" + post._id);
});

router.get('/blog/:id', isLoggedIn, async function (req, res) {
    var post = await getPost(req.params.id);
    res.render("blog", { user: req.user, post, comment: null });
});

router.post('/blog/updatepost', isLoggedIn, async function (req, res) {
    var post = await Post.findOneAndUpdate({ _id: req.body.id }, { $set: { title: req.body.title, body: req.body.body } });
    res.redirect("/post/blog/" + req.body.id);
});

router.get('/blog/:id/update', async function (req, res) {
    var post = await getPost(req.params.id);
    res.render("editor", { post });
});

router.post('/blog/addcomment', isLoggedIn, async function (req, res) {
    var comment = { body: req.body.comment, by: req.user._id, author: req.user.username, category: 'blog' };
    var post = await Post.findOneAndUpdate({ _id: req.body.id }, { $push: { comments: comment } });
    res.redirect("/post/blog/" + req.body.id);
});

router.get('/blog/:postId/comments/:commentId/update', isLoggedIn, async function (req, res) {
    var post = await getPost(req.params.postId);
    var reqComment;
    for (comment of post.comments) {
        if (comment._id == req.params.commentId) {
            reqComment = comment;
            break;
        }
    }
    res.render("blog", { user: req.user, post, comment: reqComment });
});

router.post('/blog/comments/update', isLoggedIn, async function (req, res) {

    await Post.updateOne(
        { _id: req.body.postId, 'comments._id': req.body.commentId },
        { $set: { 'comments.$.body': req.body.comment } }
    );

    res.redirect("/post/blog/" + req.body.postId);
});

router.post("/create", isLoggedIn, async function (req, res) {
    var post = new Post({
        title: req.body.title,
        body: req.body.body,
        category: req.body.category,
        author_id: req.user._id,
        author: req.user.username
    });
    var post = await post.save()
    res.redirect("/post/" + post._id);
});

router.get('/create', isLoggedIn, function (req, res) {
    res.render('createpost', { post: null });
});

router.get('/:id', isLoggedIn, async function (req, res) {
    var post = await getPost(req.params.id);
    res.render("post", { user: req.user, post, comment: null });
});

router.post('/updatepost', isLoggedIn, async function (req, res) {
    var post = await Post.findOneAndUpdate({ _id: req.body.id }, { $set: { title: req.body.title, body: req.body.body, category: req.body.category } });
    res.redirect("/post/" + req.body.id);
});

router.get('/:id/update', isLoggedIn, async function (req, res) {
    var post = await getPost(req.params.id);
    res.render("createpost", { user: req.user, post });
});

router.get('/:id/delete', isLoggedIn, async function (req, res) {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/users/" + req.user._id);
});

router.post('/addcomment', isLoggedIn, async function (req, res) {
    var comment = { body: req.body.comment, by: req.user._id, author: req.user.username };
    var post = await Post.findOneAndUpdate({ _id: req.body.id }, { $push: { comments: comment } });
    res.redirect("/post/" + req.body.id);
});

router.get('/:postId/comments/:commentId/update', isLoggedIn, async function (req, res) {
    var post = await getPost(req.params.postId);
    var reqComment;
    for (comment of post.comments) {
        if (comment._id == req.params.commentId) {
            reqComment = comment;
            break;
        }
    }
    res.render("post", { user: req.user, post, comment: reqComment });
});

router.post('/comments/update', isLoggedIn, async function (req, res) {

    await Post.updateOne(
        { _id: req.body.postId, 'comments._id': req.body.commentId },
        { $set: { 'comments.$.body': req.body.comment } }
    );

    res.redirect("/post/" + req.body.postId);
});

router.get('/:postId/comments/:commentId/delete', isLoggedIn, async function (req, res) {
    var comment = await Post.update(
        { '_id': req.params.postId },
        { '$pull': { 'comments': { '_id': req.params.commentId } } }
    );
    res.redirect("/users/" + req.user._id);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;