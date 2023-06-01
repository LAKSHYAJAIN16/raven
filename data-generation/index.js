import { ChatGPTAPI } from "chatgpt";
import Authenticator from "openai-authenticator";

async function example() {
  const api2 = new ChatGPTAPI({
    apiKey:"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",
  })

  const res = await api2.sendMessage("What is 1+1?");

  console.log(res.text);
}

example();
