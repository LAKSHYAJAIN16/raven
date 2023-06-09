const Post = require("../../models/Post");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

async function algorithm(req, res) {
  //Config env
  dotenv.config();
  
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  try {
    //Simple get request
    const posts = await Post.find();
    res.json({
      code: 0,
      data: posts,
    });
  } catch (err) {
    res.json({
      code: 1,
      error : err
    });
  }
}

module.exports = algorithm;
