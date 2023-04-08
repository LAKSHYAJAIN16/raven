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
  const act_otp = await otp.save();

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    service: "outlook",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log("Server validation done and ready for messages.");
      const email = {
        from: process.env.EMAIL_ID,
        to: req.body.email,
        subject: "Email Verification for Raven",
        html: `
        <body>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
        
        .text {
            font-family: 'Righteous', cursive;
        }
    </style>
        <div style="min-width:1000px;overflow:auto;line-height:2" class="text">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:3em;color: #00466a;text-decoration:none;font-weight:600">raven</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Welcome to Raven! Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 10px 10px 10px 10px;color: #fff;border-radius: 4px; font-size:3em">${otp.OTP}</h2>
    <p style="font-size:0.9em;">Regards</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>raven</p>
    </div>
  </div>
</div>
</body>
        `,
      };

      transporter.sendMail(email, function (error, success) {
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          console.log("Nodemailer Email sent: " + success.response);
          res.json({
            nodemailer: success.response,
            otp_object: {
              _id : act_otp._id,
              username : act_otp.username,
            }
          });
        }
      });
    }
  });
}

module.exports = verifyEmail;
