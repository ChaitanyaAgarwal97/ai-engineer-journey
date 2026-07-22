import Groq, { APIConnectionError, AuthenticationError } from "groq-sdk";
import { askPrompt, closePrompt } from "./input.js";
import { GROQ_API_KEY } from "./config.js";

let history: { role: "user" | "assistant" | "system"; content: string }[] = [];

export default async function () {
  const client = new Groq({ apiKey: GROQ_API_KEY });

  while (true) {
    console.log("\n-------------------------------------");
    const prompt = await askPrompt();
    if (prompt) {
      if (prompt.trim().toLowerCase() === "exit") {
        break;
      }
      if (prompt.trim().toLowerCase() === "clear") {
        history = [];
        console.log("\nSystem:\nConversation history cleared.");
        continue;
      }
      try {
        const response = await client.chat.completions.create({
          messages: [
            ...history,
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "openai/gpt-oss-20b",
        });

        const responseMessage = response.choices[0]?.message?.content;
        history.push({
          role: "user",
          content: prompt,
        });
        if (responseMessage) {
          history.push({
            role: "assistant",
            content: responseMessage,
          });
        }
        console.log("\nAI:\n" + responseMessage);
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
  }

  closePrompt();
}
