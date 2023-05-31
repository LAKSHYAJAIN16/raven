const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg",
      required: false,
    },
    cover: {
      type: String,
      default: "",
      required: false,
    },
    bio: {
      type: String,
      default: "Hi! I'm a proud Raven member!",
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique : true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
