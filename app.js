const express = require('express');
// const messageRoutes = require("./routes/message");
const dotenv = require('dotenv');
dotenv.config();
const wwebjs_client = require('./wwebjs');
const assistant_client = require('./assistant');
const contacts = require('./contacts');
// const fs = require('fs');
// const axios = require('axios');
// const path = require('path');

// Retrieve the assistant, from openai
const assistant_id = process.env.ASSISTANT_ID;
let assistant = {};
async function main() {
    assistant = await assistant_client.retrive_assistant(assistant_id);
}
main();

// CANCEL A RUN
// const OpenAI  = require('openai');
// const openai = new OpenAI();
// async function main_a() {
//     const run = await openai.beta.threads.runs.cancel(
//       "thread_mDxpeHsijTpt4KjnTBs08bRe",
//       "run_gjTJfklT4kBVFktqYhAs2fHe"
//     );
//     console.log(run);
// }
// main_a();

// wwebjs_client.on('message', async (message) => {
    
// 	if(message.from != "22997074355@c.us" && message.from != "status@broadcast") {

// 		const userMessage = message.body;
//         const userContact = message.from;

//         // Now we are going to retrieve the thread the contact is associated to
//         // using contacts.json file, to get the thread_id, and then retrive the thread
//         const phone = userContact.split('@')[0];
//         const contact = contacts.get_contact(phone);
//         if(!contact) {
//             return false;
//         }
//         const thread_id = contact.thread_id;
//         const thread = await assistant_client.retrive_thread(thread_id);

//         await assistant_client.add_message(thread, role="user", content=userMessage);

//         // console.log("thread", thread);
//         // console.log("assistant", assistant);

//         const run = await assistant_client.run(assistant, thread); // we do not use running instruction

//         const status = await assistant_client.check_run(thread, run, contact);

//         if(status === "expired") {
//             console.log("EXPIRED : Running time is out !");
//         }
//         else if(status === "failled") {
//             console.log("FAILED : An error occure after run, assitant didn't send response message !");
//         }
//         else if(status === "completed") {

//             console.log("COMPLETED");
            
//             // get assistant message
//             const assistant_message = await assistant_client.assistant_message(thread);

//             // Display the assistant's response
//             console.log('Assistant Response:', assistant_message);

//             // get assistant message content
//             const assistant_response = assistant_message.content[0].text.value; // assign the correct attribute

//             // add assistant message content to thread with role=assistantn ça n'a pas marché aussi avec assistant
//             await assistant_client.add_message(thread, role="user", content=assistant_response );
            
//             // send the assistant message to whatsapp
// 		    await wwebjs_client.sendMessage(userContact, assistant_response);

//         }
		
// 	}

// });

// SIMULATE SLEEP
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// APP
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
// app.use("/message", messageRoutes);

module.exports = app;