const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const createUser = require("./routes/create/user");

const app = express();
const port = 5000;
const uri =
  "mongodb+srv://lakshya:Jimin123@cluster0.v76vo5l.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create/user", async(req, res) => {
  await createUser(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
