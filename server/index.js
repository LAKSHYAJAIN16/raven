const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const verifyEmail = require("./routes/email/verify-email");
const createUser = require("./routes/create/user");
const createPost = require("./routes/create/post");
const allPosts = require("./routes/get/allPosts");
const heartOrFire = require("./routes/update/heartOrFire");

dotenv.config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create/user", async (req, res) => {
  await createUser(req, res);
});

app.post("/create/post", async (req, res) => {
  await createPost(req, res);
});

app.post("/email/verify-email", async (req, res) => {
  await verifyEmail(req, res);
});

app.post("/create/heart-fire", async (req, res) => {
  await heartOrFire(req, res);
});

app.get("/get/posts", async (req, res) => {
  await allPosts(req, res);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
