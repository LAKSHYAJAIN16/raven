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
      unique: false,
      // Should be true, but for testing no
    },
    helia_id: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
