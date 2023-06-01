const User = require("../../models/User");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

async function addHeliaId(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  //Get our OTP
  try {
    // we do it two times because of a bug XD
    const user = await User.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      {
        $set: {
          helia_id: req.body.helia,
        },
      }
    ).exec();
    const user2 = await User.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      {
        $set: {
          helia_id: req.body.helia,
        },
      }
    ).exec();

    res.json({
      code: 0,
      user: user2,
    });
  } catch (err) {
    res.json({
      code: 1,
      error: err,
    });
  }
}

module.exports = addHeliaId;
