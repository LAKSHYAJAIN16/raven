import { ChatGPTAPIBrowser } from "chatgpt";
import google from "googlethis";
import axios from "axios";
import names from "./names.js";

// Some basic data
const NUM_OF_AGENTS = 10;
const FREQUENCY = 5 * 60 * 1000;
const BACKEND_URL = "http://localhost:5000";
let clients = [];

const api = new ChatGPTAPIBrowser({
  email: "noreply.itsalright@gmail.com",
  password: "Jimin@123",
});
await api.initSession();

// create clients
for (let i = 0; i < NUM_OF_AGENTS; i++) {
  // create new user
  const name = names[Math.floor(Math.random() * names.length - 1)];
  const face = await axios.get("https://100k-faces.glitch.me/random-image-url");
  const res = await axios.post(BACKEND_URL + "/c/r/e/a/t/e/user?l=Jimin@123", {
    uID: name,
    email: `${name}@gmail.com`,
    face: face.data.url,
  });
  clients.push({ data: res.data.data, posts: [] });
  console.log(res.data.data);
}

program();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function program() {
  for (let i = 0; i < clients.length; i++) {
    const client = clients[i];

    // Text post
    async function textPost() {
      // Generate text
      const result = await api.sendMessage(
        `You are a teenager. You have a personaility, with likes and dislikes. Write a social media post. Keep it short and crisp, below 200 characters. No emojis or hashtags. Keep it as natural as possible. You can write on a wide variety of people and topics. Try to show your personality. Also try to use more proper nouns and exact information. Try to encorporate relatively obscure topics and celebrities. Also form proper, gramatically correct sentences.
        `
      );
      const text = result.response;
      console.log(text);

      // Post it
      const post_payload = {
        user: {
          name: client.data.username,
          id: client.data._id,
          pfpic: client.data.profilePic,
        },
        text: text,
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
      const res2 = await axios.post(BACKEND_URL + "/create/post", post_payload);
      clients[i].posts.push(res2.data.data);
      console.log(res2.data.data);
    }

    async function imagePost() {
      // Generate text
      const result = await api.sendMessage(
        `I want two things from you. First, give a prompt for an image search engine, featuring the name of a celebrity. Then, write a caption which could be suitable for an image aligning with your prompt. Thanks`
      );
      const text = result.response;

      // separate text
      const textual_data = text.split(":");
      console.log(textual_data);
      // get prompt first
      let prompt = "";
      let open = false;
      for (let k = 0; k < textual_data[1].length; k++) {
        const char = textual_data[1][k];
        if (char === '"' && open === false) {
          open = true;
          continue;
        }
        if (char === '"' && open === true) {
          open = false;
          break;
        }
        if (open === true) {
          prompt += char;
        }
      }
      console.log(prompt);

      // now, get the caption
      let caption = "";
      let open2 = false;
      for (let k = 0; k < textual_data[2].length; k++) {
        const char = textual_data[2][k];
        if (char === '"' && open2 === false) {
          open2 = true;
          continue;
        }
        if (char === '"' && open2 === true) {
          open2 = false;
          break;
        }
        if (open2 === true) {
          caption += char;
        }
      }
      console.log(caption);

      // get images
      const images = await google.image(prompt, { safe: false });

      // random number of images
      images.length = Math.floor(Math.random() * 1) + 1;
      let act_images = [];
      for (let m = 0; m < images.length; m++) {
        act_images.push(images[m].url);
      }

      // Post it
      const post_payload = {
        user: {
          name: client.data.username,
          id: client.data._id,
          pfpic: client.data.profilePic,
        },
        text: caption,
        type: 1,
        images: act_images,
        videos: [],
        richText: "",
        md: "",
        news: {
          topic: "nan",
          desc: "nan",
        },
      };
      const res2 = await axios.post(BACKEND_URL + "/create/post", post_payload);
      clients[i].posts.push(res2.data.data);
      console.log(res2.data.data);
    }

    // flip a coin to decide whether we'll do a text or an image post
    try {
      const coin = Math.random();
      if (coin >= 0.7) {
        await imagePost();
      } else {
        await textPost();
      }
    } catch (err) {
      // got rate limated lmao
      console.log("are ratelimitted");
      continue;
    }
  }

  await sleep(FREQUENCY);
  program();
}
