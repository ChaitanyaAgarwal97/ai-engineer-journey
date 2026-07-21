import Groq, { APIConnectionError, AuthenticationError } from "groq-sdk";
import { askPrompt, closePrompt } from "./input.js";
import { GROQ_API_KEY } from "./config.js";

export default async function () {
  const client = new Groq({ apiKey: GROQ_API_KEY });

  while (true) {
    console.log("\n-------------------------------------");
    const prompt = await askPrompt();
    if (prompt.trim().toLowerCase() === "exit") {
      break;
    }
    try {
      const response = await client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "openai/gpt-oss-20b",
      });

      console.log("\nAI:\n" + response.choices[0]?.message?.content);
    } catch (e) {
      if (e instanceof APIConnectionError) {
        console.log(
          "\nSystem:\nPlease check your internet connection and try again.",
        );
      } else if (e instanceof AuthenticationError) {
        console.log("\nSystem:\nUnexpected error occurred.");
      }
    }
  }

  closePrompt();
}
