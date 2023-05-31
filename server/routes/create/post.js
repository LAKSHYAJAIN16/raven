const Post = require("../../models/Post");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
async function createPost(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  //Get our OTP
  try {
    //Compile data from body
    const post = new Post({
      user : req.body.user.name,
      userID : req.body.user.id,
      userPfpic : req.body.user.pfpic,
      text : req.body.text,
      type : req.body.type,
      images : req.body.images || [],
      videos : req.body.videos || [],
      richText : req.body.richText || "",
      md : req.body.md || "",
      news : {
        topic : req.body.news.topic || "",
        desc : req.body.news.desc || ""
      },
      hearts : [],
      fires : [],
      comments : [],
    });

    const act_post = await post.save();
    res.json({
      code: 0,
      data: act_post,
    });
  } catch (err) {
    res.json({
      code: 1,
      error : err
    });
  }
}

module.exports = createPost;
