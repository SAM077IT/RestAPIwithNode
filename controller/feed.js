exports.getPosts = (req, res, next) => {
  console.log("form getPost controller");
  res.status(200).json({
    posts: [{
      _id: "1",
      title: 'My 1st Post!',
      creator: { name: 'Sam' },
      createdAt: new Date(),
      image: "/images/myDuck.jpg",
      content: 'Hello all, You are Welcome'
    }]
  });
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
