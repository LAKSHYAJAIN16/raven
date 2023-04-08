const User = require("../../models/User");
const dotenv = require("dotenv");
const OTP = require("../../models/OTP");
const mongoose = require("mongoose");

async function createUser(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  //Get our OTP
  try {
    const otp = await OTP.findById(req.body.id);
    const dur =
      (new Date(Date.now()).getTime() - new Date(otp.toc).getTime()) / 1000;
    console.log(dur);

    //Check if everything matches
    if (parseInt(otp.OTP) === parseInt(req.body.otp)) {
      if (dur <= 240) {
        //Now, we create the actual user LOL
        const user = new User({
          username: req.body.uID.split(":")[0],
          email: req.body.email,
          toc: Date.now(),
        });

        const act_user = await user.save();
        res.json({
          code: 2,
          data: act_user,
        });
      }
      else{
        res.json({
          code : 4,
        })
      }
    } else {
      res.json({
        code: 1,
      });
    }
  } catch (err) {
    res.json({
      code: 3,
    });
  }
}

module.exports = createUser;
