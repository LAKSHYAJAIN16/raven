const Post = require("../../models/Post");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

async function heartOrFire(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  //Get our OTP
  try {
    //Compile data from body
    if (req.body.type === 0) {
      const post = await Post.findOneAndUpdate(
        {
          _id: req.body.id,
        },
        {
          $push: {
            hearts: req.body.toc,
          },
        }
      ).exec();

      res.json({
        code: 0,
        data: post,
      });
    } else {
      const post = await Post.findOneAndUpdate(
        {
          _id: req.body.id,
        },
        {
          $push: {
            fires: req.body.toc,
          },
        }
      ).exec();

      res.json({
        code: 0,
        data: post,
      });
    }
  } catch (err) {
    res.json({
      code: 1,
      error: err,
    });
  }
}

module.exports = heartOrFire;
