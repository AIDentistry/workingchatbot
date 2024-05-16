import { NextResponse } from "ai";
import OpenAI from "openai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: "sk-proj-yFxVCIA5orooulkgCdPdT3BlbkFJJRl0nhVCTQj5pSwqoArG" || "",
});

// IMPORTANT! Set the runtime to edge
const runtime = "edge";

async function POST(req) {
  // Parse the request body
  const input = await req.json();

  // Create a thread if needed
  const threadId = input.threadId || (await openai.beta.threads.create({})).id;

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });

  let run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: process.env.ASSISTANT_ID,
    instructions:
      "Please address the user as Jane Doe. The user has a premium account.",
  });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
      }
      return Response.json({ messages: messages.data });
    }
}

module.exports = { POST };
