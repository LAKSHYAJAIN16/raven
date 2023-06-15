const Embedding = require("../../models/Embedding");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

async function createEmbedding(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  //Get our OTP
  try {
    //Compile data from body
    const embedding = new Embedding({
      _id : req.body.id,
      embeddings : req.body.embeddings,
      pos : req.body.pos,
    }, {
      _id : req.body.id
    });

    const embedding_act = await embedding.save();
    res.json({
      code: 0,
      data: embedding_act,
    });
  } catch (err) {
    res.json({
      code: 1,
      error : err
    });
  }
}

module.exports = createEmbedding;
