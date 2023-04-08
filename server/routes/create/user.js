const User = require("../../models/User");
const dotenv = require("dotenv");
const OTP = require("../../models/OTP");
const mongoose = require("mongoose");

async function createUser(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  //Get our OTP
  const otp = await OTP.findById(req.body.id);
  console.log(otp.OTP);
  console.log(req.body.otp);

  //Check if everything matches
  if (parseInt(otp.OTP) === parseInt(req.body.otp)) {
    //Now, we create the actual user LOL
    const user = new User({
      username: req.body.uID.split(":")[0],
      email: req.body.email,
      toc : Date.now(),
    });

    const act_user = await user.save();
    res.json({
        code : 2,
        data : act_user,
    });
  } else {
    res.json({
      code: 1,
    });
  }
}

module.exports = createUser;
