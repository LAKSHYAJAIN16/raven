const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const OTP = require("../../models/OTP");
const mongoose = require("mongoose");

async function verifyEmail(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  //First, create OTP schema
  const otp = new OTP({
    toc: Date.now(),
    username: req.body.username,
    OTP: Math.floor(Math.random() * 999999),
  });
  console.log(otp);
  const act_otp = await otp.save();
  res.json({ otp_object: otp });
}

module.exports = verifyEmail;
