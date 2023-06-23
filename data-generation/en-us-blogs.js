import { createReadStream } from "fs";
import { createInterface } from "readline";
import axios from "axios";

const NUM_OF_AGENTS = 20;
let clients = [];

async function generateUser() {
  // create new user
  const details = await axios.get("https://randomuser.me/api/");
  const name =
    details.data.results[0].name.first +
    " " +
    details.data.results[0].name.last;
  const face = details.data.results[0].picture.large;
  const email = details.data.results[0].email;
  const res = await axios.post(
    "http://localhost:5000/c/r/e/a/t/e/user?l=Jimin@123",
    {
      uID: name,
      email: email,
      face: face,
    }
  );
  clients.push({ data: res.data.data });
  console.log(res.data.data);
}

for (let j = 0; j < NUM_OF_AGENTS; j++) {
  await generateUser();
}

const file = createInterface({
  input: createReadStream("en_US.blogs.txt"),
  output: process.stdout,
  terminal: false,
});

let texts = [];
file.on("line", async (line) => {
  // Split line
  try {
    // Remove any @
    const words = line.split(" ");
    let n_text = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.includes("@")) {
        continue;
      }
      if(word.includes("#")){
        continue;
      } 
      if(word.includes("&")){
        continue;
      }
      if(word.includes("?")){
        continue;
      }
      else {
        n_text += word;
        n_text += " ";
      }
    }

    texts.push(n_text);
  } catch (err) {}
});

file.on("close", async () => {
  let j = 0;
  for (let k = 0; k < texts.length; k++) {
    try {
      // Send request with our client
      const n_text = texts[k];
      const client = clients[j];
      console.log("AGENT", j);
      const post_payload = {
        user: {
          name: client.data.username,
          id: client.data._id,
          pfpic: client.data.profilePic,
        },
        text: n_text,
        type: 0,
        images: [],
        videos: [],
        richText: "",
        md: "",
        news: {
          topic: "nan",
          desc: "nan",
        },
      };
      if (n_text === "" || n_text === null || n_text === undefined) continue;
      // Send post to backend
      const res2 = await axios.post(
        "http://localhost:5000/create/post",
        post_payload
      );
      if (res2.code === 1) continue;
      if (res2.data.data._id === null || res2.data.data._id === undefined)
        continue;
      // Now generate embeddings
      const embedding_url = `http://127.0.0.1:1010/embed?t=${n_text}&id=${res2.data.data._id}`;
      console.log(embedding_url);
      const res3 = await axios.get(embedding_url);

      // Now, send this data to backend
      const embedding_payload = {
        id: res2.data.data._id,
        embeddings: res3.data.embeddings[0],
      };
      const res4 = await axios.post(
        "http://localhost:5000/create/embedding",
        embedding_payload
      );
      console.log({ txt: n_text, agent: j });

      if (j === NUM_OF_AGENTS - 1) {
        j = 0;
      } else {
        j += 1;
      }
    } catch (err) {
      console.log(err);
      continue;
    }
  }
});
