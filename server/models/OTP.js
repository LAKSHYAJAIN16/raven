const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    OTP : {
        type : String,
        required : true,
    },
    toc : {
        type : Number,
        required : true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", OTPSchema);
