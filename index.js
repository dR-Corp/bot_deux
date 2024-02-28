// IMPORT
const express = require('express')
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const { OpenAIAPI } = require('openai');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

// VARIABLES
const app = express()
const port = 3000

// OBJECTS
const client = new Client();

// SERVER
app.get('/', async (req, res) => {
    res.send('Hello, World!');
});

app.post('/send', async (req, res) => {
    console.log(req.body);
    // const { message } = req.body;
    // res.json(req.body);
    // res.json({ receivedMessage: message });
});

app.listen(port, (req, res)=> {
    console.log(`Server listenning on port http://localhost:${port}`);
})

// WAWEB

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

client.on('message', (message) => {
	console.log(message.body);
    console.log(1);
});

client.on('message', async (message) => {
	if (message.body === '!ping') {
		await client.sendMessage(message.from, 'pong');
	}
});

