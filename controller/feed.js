const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find().then(posts => {
    if (!posts) {
      res.status(200).json({ message: "No one posted yet!" });
    }
    res.status(200).json({ message: "posts are fatched successfully!", posts: posts })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId).then(post => {
    if (!post) {
      const error = new Error("Could not find the post!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Post fatched", post: post })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed on the server end!");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  //create post in DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/myDuck.jpg",
    creator: { name: "Samirul" }
  });
  post.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "Post created successfully!",
      post: result
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};
