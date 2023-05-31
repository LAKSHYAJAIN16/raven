const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user : {
        type : String,
        required : true,
    },
    userID : {
        type : String,
        required : true,
    },
    userPfpic : {
        type : String,
        required : true,
    },
    text : {
        type : String,
        required : false,
        default : "",
    },
    type : {
        type : Number,
        min : 0,
        max : 6,
    },
    images : {
        type : [String],
        required : false,
        default : [],
    },
    videos : {
        type : [String],
        required : false,
        default : [],
    },
    richText : {
        type : String,
        required : false,
        default : "",
    },
    md : {
        type : String,
        required : false,
        default : ""
    },
    news : {
        topic : {
            type : String,
            required : true,
        },
        desc : {
            type : String,
            required : true,
        },
    },
    hearts : {
        type : [String],
        default : [],
    },
    fires : {
        type : [String],
        default : [],
    },
    comments : {
        type : [Object],
        default : [],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
