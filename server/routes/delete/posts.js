const Post = require("../../models/Post");
const dotenv = require("dotenv");
const OTP = require("../../models/OTP");
const mongoose = require("mongoose");

async function deletePosts(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  //Get our OTP
  try {
    if (req.query.l === process.env.OVERRIDE_KEY) {
      //Now, we create the actual user LOL
      const res2 = await Post.deleteMany({});
      res.json({
        code: 2,
        data: res2,
      });
    } else {
      res.send("frick-off");
    }
  } catch (err) {
    res.json({
      code: 3,
      error: err,
    });
  }
}

module.exports = deletePosts;
