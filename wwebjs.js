const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, RemoteAuth, MessageMedia} = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Local authentication methods
        // const client = new Client({
        //     authStrategy: new LocalAuth()
        // });
        // client.on('qr', (qr) => {
        //     qrcode.generate(qr, { small: true });
        // });
        // client.on('ready', async () => {
        //     console.log('Client is ready!');
        // });
        // client.initialize();

        const connect = async () => {

            await mongoose.connect(process.env.MONGODB_URI)
                .then(() => console.log('Connexion à MongoDB réussie !'))
                .catch(() => console.log('Connexion à MongoDB échouée !'));

            const store = new MongoStore({ mongoose: mongoose });
            const client = new Client({
                authStrategy: new RemoteAuth({
                    store: store,
                    backupSyncIntervalMs: 300000
                })
            });

            client.on('qr', (qr) => {
                qrcode.generate(qr, { small: true });
            });

            client.on('ready', async () => {
                console.log('Client is ready!');
            });

            client.on('remote_session_saved', () => {
                console.log("Remote session saved!");
            });

            client.initialize();

            module.exports = client

            return client;
        }

        console.log(connect());;
            

// Remote authentication methods
// mongoose.connect(process.env.MONGODB_URI).then(() => {

//     console.log('Connexion à MongoDB réussie !')

//     const store = new MongoStore({ mongoose: mongoose });
//     const client = new Client({
//         authStrategy: new RemoteAuth({
//             store: store,
//             backupSyncIntervalMs: 300000
//         })
//     });

//     client.on('qr', (qr) => {
//         qrcode.generate(qr, { small: true });
//     });

//     client.on('ready', async () => {
//         console.log('Client is ready!');
//     });

//     client.on('remote_session_saved', () => {
//         console.log("Remote session saved!");
//     });

//     client.initialize();

//     module.exports = client
    
// }).catch(() => console.log('Connexion à MongoDB échouée !'));;


 
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

// module.exports = client