const openai = require('openai');
const axios = require('axios');

// Initialize OpenAI client
const client = new openai({ apiKey: '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' }); // Replace with your actual API key

// Function to create an Assistant
const createAssistant = async () => {
  const file = await client.files.create({
    file: openai.FileContent.fromFile("speech.py"), // Replace with your file content
    purpose: 'assistants',
  });

  const assistant = await client.beta.assistants.create({
    name: "Data Visualizer",
    description: "Your assistant description",
    model: "gpt-4-turbo-preview",
    tools: [{ type: "code_interpreter" }],
    file_ids: [file.id],
  });

  return assistant;
};

// Function to create a Thread
const createThread = async (assistant, file) => {
  const thread = await client.beta.threads.create({
    messages: [
      {
        role: "user",
        content: "Create 3 data visualizations based on the trends in this file.",
        file_ids: [file.id],
      },
    ],
  });

  return thread;
};

// Function to run the Assistant
const runAssistant = async (assistant, thread) => {
  const run = await client.beta.threads.runs.create({
    thread_id: thread.id,
    assistant_id: assistant.id,
    model: "gpt-4-turbo-preview",
    instructions: "New instructions that override the Assistant instructions",
    tools: [{ type: "code_interpreter" }, { type: "retrieval" }],
  });

  return run;
};

// Function to check the Run status
const checkRunStatus = async (thread, run) => {
  let runStatus = await client.beta.threads.runs.retrieve({
    thread_id: thread.id,
    run_id: run.id,
  });

  while (runStatus.status !== "completed") {
    // Polling logic, adjust as needed
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before polling again
    runStatus = await client.beta.threads.runs.retrieve({
      thread_id: thread.id,
      run_id: run.id,
    });
  }

  const assistantMessages = await client.beta.threads.messages.list({
    thread_id: thread.id,
  });

  // Process and display assistantMessages
  console.log("Assistant's response:", assistantMessages);
};

// Main execution
const main = async () => {
  try {
    const assistant = await createAssistant();
    const file = await client.files.retrieve({ file_id: assistant.file_ids[0] });
    const thread = await createThread(assistant, file);
    const run = await runAssistant(assistant, thread);
    await checkRunStatus(thread, run);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Execute the main function
main();
