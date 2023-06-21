const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const verifyEmail = require("./routes/email/verify-email");
const createUser = require("./routes/create/user");
const createPost = require("./routes/create/post");
const allPosts = require("./routes/get/allPosts");
const heartOrFire = require("./routes/update/heartOrFire");
const addHeliaId = require("./routes/update/helia-callback");
const adminUser = require("./routes/create/u-user");
const deletePosts = require("./routes/delete/posts");
const algorithm = require("./routes/get/algorithm");
const createEmbedding = require("./routes/create/embeddings");
const getEmbedding = require("./routes/get/embeddings");
const deleteEmbeddings = require("./routes/delete/embeddings");

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

app.post("/c/r/e/a/t/e/user", async(req, res) => {
  await adminUser(req, res);
})

app.post("/create/post", async (req, res) => {
  await createPost(req, res);
});

app.post("/email/verify-email", async (req, res) => {
  await verifyEmail(req, res);
});

app.post("/create/heart-fire", async (req, res) => {
  await heartOrFire(req, res);
});

app.post("/create/helia", async(req, res) => {
  await addHeliaId(req, res);
});

app.post("/create/embedding", async(req, res) => {
  await createEmbedding(req, res);
})

app.get("/get/posts", async (req, res) => {
  await allPosts(req, res);
});

app.post("/get/embeddings", async(req, res) => {
  await getEmbedding(req, res);
})

app.get("/del/posts", async(req, res) => {
  await deletePosts(req, res);
})

app.get("/del/embeddings", async(req, res) => {
  await deleteEmbeddings(req, res);
});

app.get("/get/algorithm", async(req, res) => {
  await algorithm(req, res);
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
