const Embedding = require("../../models/Embedding");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

async function getEmbedding(req, res) {
  //Config env
  dotenv.config();
  const mong = await mongoose.connect(process.env.MONGO_URL, {});

  try {
    //Simple get request
    const embedding = await Embedding.findById(req.body.id);
    res.json({
      code: 0,
      id : req.body.id,
      data: embedding
    });
  } catch (err) {
    res.json({
      code: 1,
      error : err
    });
  }
}

module.exports = getEmbedding;
