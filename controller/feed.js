exports.getPosts = (req, res, next) => {
  console.log("form getPost controller");
  res.status(200).json({ post: [{ Name: "Samirul Islam", Type: "Male" }] });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  //create post in DB

  res.status(201).json({
    message: "Post created successfully!",
    post: { id: new Date().toDateString(), title: title, content: content },
  });
};
