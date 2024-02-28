const openai = require('openai');
const axios = require('axios');

// Initialize OpenAI client
const client = new openai.OpenAIAPI({ key: 'your-api-key' }); // Replace with your actual API key

// Function to create an Assistant
const createAssistant = async () => {
  const assistant = await client.beta.assistants.create({
    name: "Math Tutor",
    instructions: "You are a personal math tutor. Write and run code to answer math questions.",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4-turbo-preview",
  });

  return assistant;
};

// Function to create a Thread
const createThread = async () => {
  const thread = await client.beta.threads.create();
  return thread;
};

// Function to add a Message to a Thread
const addMessageToThread = async (thread, content) => {
  const message = await client.beta.threads.messages.create({
    thread_id: thread.id,
    role: "user",
    content: content,
  });

  return message;
};

// Function to run the Assistant
const runAssistant = async (thread, assistant, instructions) => {
  const run = await client.beta.threads.runs.create({
    thread_id: thread.id,
    assistant_id: assistant.id,
    instructions: instructions,
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
    thread_id: thread.id
  });

  // Process and display assistantMessages
  console.log("Assistant's response:", assistantMessages);
};

// Main execution
const main = async () => {
  try {
    const assistant = await createAssistant();
    const thread = await createThread();
    const userMessageContent = "I need to solve the equation `3x + 11 = 14`. Can you help me?";
    const userMessage = await addMessageToThread(thread, userMessageContent);
    const runInstructions = "Please address the user as Jane Doe. The user has a premium account.";
    const run = await runAssistant(thread, assistant, runInstructions);
    await checkRunStatus(thread, run);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Execute the main function
main();
