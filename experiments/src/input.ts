import readline from "readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function askPrompt(): Promise<string> {
  return await rl.question("\nUser:\n> ");
}

export function closePrompt(): void {
  rl.close();
}
