// require('dotenv').config(); // Load environment variables from .env file

const express = require('express')
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const bodyParser = require('body-parser');
const fs = require('fs');
const { OpenAIAPI } = require('openai');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

const app = express()
const port = 3000

// Middleware to parse JSON requests
app.use(bodyParser.json());
dotenv.config();
// console.log(`Your port is ${process.env.PORT}`); // 8626

const SESSION_FILE_PATH = './session.json';
let sessionData;

const OPENAI_API_KEY = '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';
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// const ASSISTANT_ID = process.env.ASSISTANT_ID;
const openai = new OpenAIAPI({ key: OPENAI_API_KEY });

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/api/message', (req, res) => {
    const { message } = req.body;
    res.json({ receivedMessage: message });
});

app.listen(port, (req, res)=> {
    console.log(`Server listenning on port http://localhost:${port}`);
})

const client = new Client({
	puppeteer: {
		args: ['--no-sandbox'],
	},
    session: sessionData,
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
    console.log('Authenticated');
    sessionData = session;
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
});

client.on('ready', () => {
    console.log('Client is ready!');
    sendMessage('22999006977', 'Hello! This is your WhatsApp Bot.');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.on('message', async (message) => {
	if (message.body === '!ping') {
		await client.sendMessage(message.from, 'pong');
	}
});

// // SEND IMAGE
// client.on('message', async (message) => {
//     // Rest of the code...
  
//     // Example: Sending an image
//     if (message.body.toLowerCase() === 'send image') {
//       const imagePath = path.join(__dirname, 'path/to/your/image.jpg'); // Replace with the actual path to your image
//       const media = MessageMedia.fromFilePath(imagePath);
  
//       // Send the image as a message
//       await message.reply(media);
//     }
  
//     // Rest of the code...
// });

// client.on('message', async (message) => {
//     const userMessage = message.body;
  
//     // Use OpenAI to generate a response
//     const botResponse = await openai.complete({
//       model: 'text-davinci-003', // Use the appropriate model
//       prompt: userMessage,
//       temperature: 0.7, // Adjust as needed
//       max_tokens: 150, // Adjust as needed
//     });

//     // Extract the response from the OpenAI API result
//     const responseText = botResponse.data.choices[0].text.trim();
  
//     // Send the response back to the user
//     message.reply(responseText);
// });

const headers = {
    'Content-Type': 'application/json',
};
const url = 'https://31de05b5-8201-47d3-8e83-6ada51e8db12-00-3sbvag3mypxyq.spock.replit.dev/start';
axios.get(url, { headers })
  .then(response => {
    // Assuming the response is a JSON object with a "thread_id" property
    const threadId = response.data.thread_id;

    console.log('Thread ID:', threadId);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

 
client.initialize();

// Handle process termination to logout from WhatsApp Web
// process.on('SIGINT', function() {
//     if (client) {
//       client.logout();
//     }
//     process.exit();
// });

// Function to send a message to a specific phone number
async function sendMessage(number, text) {
    try {
      const chat = await client.getChatById(`${number}@c.us`);
      chat.sendMessage(text);
      console.log(`Message sent to ${number}: ${text}`);
    } catch (error) {
      console.error(`Error sending message to ${number}:`, error);
    }
  }