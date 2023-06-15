const mongoose = require("mongoose");

const Embedding = new mongoose.Schema(
  {
    embeddings : {
        type : [Number],
        required : true,
    },
    post_id : {
        type : String,
        required : true,
    },
    pos : {
      type : [],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Embedding", Embedding);
