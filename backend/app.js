const dotenv = require('dotenv');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept");

  res.setHeader("Access-Control-Allow-Methods",
                "GET, POST, PATH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    console.log(post);
    res.status(201).json({
      message: "Post added succesfully",
      postId: createdPost._id
    });
    });
});

app.get("/api/posts", (req, res) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched succesfylly!",
      posts: documents
    });
  });
});

app.delete("/api/posts/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});


module.exports = app;
