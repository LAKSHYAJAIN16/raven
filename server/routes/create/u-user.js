const User = require("../../models/User");
const dotenv = require("dotenv");
const OTP = require("../../models/OTP");
const mongoose = require("mongoose");

async function adminUser(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  //Get our OTP
  try {
    if (req.query.l === process.env.OVERRIDE_KEY) {
      //Now, we create the actual user LOL
      const user = new User({
        username: req.body.uID,
        email: req.body.email,
        toc: Date.now(),
        profilePic : req.body.face,
      });

      const act_user = await user.save();
      res.json({
        code: 2,
        data: act_user,
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

module.exports = adminUser;
