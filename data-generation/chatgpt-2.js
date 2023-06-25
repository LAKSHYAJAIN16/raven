import { createReadStream } from "fs";
import { createInterface } from "readline";
import { ChatGPTAPIBrowser } from "chatgpt";
import google from "googlethis";
import axios from "axios";

const NUM_OF_AGENTS = 20;
const NUM_PER_TOPIC = 4;
let clients = [];

const api = new ChatGPTAPIBrowser({
  email: "noreply.itsalright@gmail.com",
  password: "Jimin@123",
});
await api.initSession();

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

for (let j = 0; j < NUM_OF_AGENTS; j++) {
  await generateUser();
}

const file = createInterface({
  input: createReadStream("trends.txt"),
  output: process.stdout,
  terminal: false,
});

let texts = [];
file.on("line", async (line) => {
  // Split line
  try {
    // Remove any @
    const words = line.split(",");
    const brand = words[4];
    console.log(brand);
    texts.push(brand);
  } catch (err) {}
});

console.log(texts.length);
file.on("close", async () => {
  let j = 0;
  for (let k = 0; k < texts.length; k++) {
    const n_text = texts[k];
    for (let I = 1; I <= NUM_PER_TOPIC; I++) {
      try {
        // Send request with our client
        console.log(n_text);
        const client = clients[j];
        if (n_text === "" || n_text === null || n_text === undefined) continue;

        // Generate content
        const result = await api.sendMessage(
          `Write a microblog on the topic '${n_text}'. It must be for not more than 200 characters. Try to add details specific to the topic. Try to include proper nouns. Also try to make it original
            `
        );
        const text = result.response;

        // Filter text for hashtags AAAAAAH
        let f_text = "";
        let tokens = text.split(' ');
        for (let k = 0; k < tokens.length; k++) {
            const word = tokens[k];
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
                f_text += word;
                f_text += " ";
              }
        }

        // Compile Payload
        const post_payload = {
          user: {
            name: client.data.username,
            id: client.data._id,
            pfpic: client.data.profilePic,
          },
          text: f_text,
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

        // Send post to backend
        const res2 = await axios.post(
          "http://localhost:5000/create/post",
          post_payload
        );
        if (res2.code === 1) continue;
        if (res2.data.data._id === null || res2.data.data._id === undefined)
          continue;
        // Now generate embeddings
        const embedding_url = `http://127.0.0.1:1010/embed?t=${n_text}&id=${res2.data.data._id}&uID=${client.data._id}&name=${client.data.username}&type=1&pfpic=${client.data.profilePic}`;
        console.log(embedding_url);
        const res3 = await axios.get(embedding_url);

        // Now, send this data to backend
        const embedding_payload = {
          id: res2.data.data._id,
          embeddings: res3.data.embeddings[0],
          pos: res3.data.keywords,
        };
        const res4 = await axios.post(
          "http://localhost:5000/create/embedding",
          embedding_payload
        );
        console.log({ txt: f_text, agent: j });

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
  }
});
