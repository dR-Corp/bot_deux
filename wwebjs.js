const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    if(message.from != "status@broadcast" && message.from != "22997074355@c.us") {
        console.log(message.from);
        console.log(message.body);
    }
    else {
        console.log("IT'S LIKE SOMEONE POST A FUCKING STATUS !");
        console.log(message.body);
    }
});

// Sending Media
// client.on('message', async (msg) => {
//     if (msg.body === '!send-media') {
//         const media = new MessageMedia('image/png', base64Image);
//         await client.sendMessage(msg.from, media);
//     }
// });
// Sending Local Files
// client.on('message', async (msg) => {
//     if (msg.body === '!send-media') {
//         const media = MessageMedia.fromFilePath('./path/to/image.png');
//         await client.sendMessage(msg.from, media);
//     }
// });
// Sending Files from a URL
// client.on('message', async (msg) => {
//     if (msg.body === '!send-media') {
//         const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
//         await client.sendMessage(msg.from, media);
//     }
// });

module.exports = client