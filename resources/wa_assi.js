const { Client } = require('whatsapp-web.js');
const axios = require('axios');
const fs = require('fs');

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your actual OpenAI API key
const SESSION_FILE_PATH = './session.json';

let sessionData;

// Load the session data if it exists
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
});

client.on('qr', (qr) => {
  console.log('Scan the QR code to authenticate');
  console.log(qr);
});

client.on('authenticated', (session) => {
  console.log('Authenticated');
  sessionData = session;
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
});

client.on('ready', () => {
  console.log('Client is ready');
});

client.on('message', async (message) => {
  // Check if the message is from the user
  if (message.fromMe) return;

  // Get the user's message
  const userMessage = message.body;

  // Create a thread
  const thread = await createThread();

  // Add the user's message to the thread
  await addMessageToThread(thread.id, 'user', userMessage);

  // Run the assistant
  const assistantResponse = await runAssistant(thread.id);

  // Add the assistant's response to the thread
  await addMessageToThread(thread.id, 'assistant', assistantResponse);

  // Send the assistant's response to the user on WhatsApp
  message.reply(assistantResponse);

  // Display the assistant's response
  console.log('Assistant Response:', assistantResponse);
});

client.initialize();

// Handle process termination to logout from WhatsApp Web
process.on('SIGINT', function () {
  if (client) {
    client.logout();
  }
  process.exit();
});

// Function to create a thread
async function createThread() {
  const response = await axios.post('https://api.openai.com/v1/beta/threads');
  return response.data.data;
}

// Function to add a message to a thread
async function addMessageToThread(threadId, role, content) {
  const response = await axios.post(`https://api.openai.com/v1/beta/threads/${threadId}/messages`, {
    role,
    content: [{ type: 'text', text: { value: content, annotations: [] } }],
  });
  return response.data.data;
}

// Function to run the assistant on a thread
async function runAssistant(threadId) {
  const response = await axios.post(`https://api.openai.com/v1/beta/threads/${threadId}/runs`, {
    assistant_id: 'YOUR_ASSISTANT_ID', // Replace with your actual Assistant ID
  });
  const runId = response.data.data.id;

  // Poll the run status until it's completed
  let runStatus;
  do {
    await sleep(2000); // Wait for 2 seconds before checking again
    const runResponse = await axios.get(`https://api.openai.com/v1/beta/threads/${threadId}/runs/${runId}`);
    runStatus = runResponse.data.data.status;
  } while (runStatus !== 'completed');

  // Get the assistant's response
  const assistantResponse = await axios.get(`https://api.openai.com/v1/beta/threads/${threadId}/runs/${runId}/assistant`);
  return assistantResponse.data.data.content;
}

// Helper function to simulate sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
