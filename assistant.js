// in assistant js
const OpenAI  = require('openai');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

const openai = new OpenAI();

exports.retrive_assistant = async (assistant_id) => {
    const assistant = await openai.beta.assistants.retrieve(
        assistant_id
    );    
    return assistant;
}

exports.create_thread = async () => {
    thread = await openai.beta.threads.create();
	return thread;
}

exports.retrive_thread = async (thread_id) => {
    const thread = await openai.beta.threads.retrieve(
        thread_id
    );
    return thread;
}

exports.add_message = async (thread, role, content) => {
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: role,
          content: content
        }
    );
    return message
}

exports.run = async (assistant, thread, instructions = "") => {
    const run = await openai.beta.threads.runs.create(
        thread.id,
        { 
          assistant_id: assistant.id
        }
    );
    return run;
}

const create_lead = async (lead) => {

    const webhookUrl = "https://hook.eu1.make.com/hgld1kxdvwxv3iu02xnxdsp98x8w5ald";

    const webhookData = lead;

    // Send a POST request to the webhook URL with the data
    const response = await axios.post(webhookUrl, webhookData)
        .then(response => {
            return {"CREATE LEAD": response.data};
        })
        .catch(error => {
            return {"CREATE LEAD": error.message};
        });

    return JSON.stringify(response);
}

// By default, a Run goes into the queued state. 
// You can periodically retrieve the Run to check on its status to see if it has moved to completed.
exports.check_run = async (thread, run, contact) => {

    let status = "queued";
    console.log("QUEUED");

    do {

        await new Promise(resolve => setTimeout(resolve, 5000)); // ajust to 5000 after
        const run_checked = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );

        status = run_checked.status;

        if(status === "requires_action") {
            console.log("REQUIRES_ACTION");
            console.log("---RUN ID---", run.id);
            console.log("---RUN CHECKED TOOLS---", run_checked.required_action.submit_tool_outputs.tool_calls);
            // performe the required actoin here, and then the run will be requeued

            for (const tool_call of run_checked.required_action.submit_tool_outputs.tool_calls) {

                // dans ce cas on le fait specialement pour create lead
                // MAIS FAUDRA UN CODE QUI EXECUTERA TOUTES LES FUNCTION, plus de if donc
                if (tool_call.function.name === "create_lead") {
                    // Process lead creation
                    const arguments = JSON.parse(tool_call.function.arguments);
                    const lead = {
                        name: contact.name,
                        phone: contact.phone,
                        address: contact.address,
                        day: arguments.day,
                        hour: arguments.hour
                    }
                    const output = await create_lead(lead);

                    console.log("---TOOL OUTPUT---", output);
                    console.log("---TOOL LEAD---", lead);

                    const run_tool_submited = await openai.beta.threads.runs.submitToolOutputs(
                        thread.id,
                        run_checked.id,
                        {
                        tool_outputs: [
                            {
                                tool_call_id: tool_call.id,
                                output: output,
                            },
                        ],
                        }
                    );
                
                    console.log("ACTION CALLED", run_tool_submited);
                
                }
            }

        }
        else if(status === "in_progress")
            console.log("IN_PROGRESS");
        else if(status === "queued")
            console.log("QUEUED");

        console.log('boucle');
        
        
    } while(status === "queued" || status === "in_progress" || status === "requires_action");

    // on retourne le status
    return status;
}

exports.assistant_message = async (thread) => {
    const messages = await openai.beta.threads.messages.list(
        thread.id
    );
    return messages.data[0];
}

exports.cancel_run = async (thread, run) => {
    run_canceled = await openai.beta.threads.runs.cancel(
        thread.id,
        run.id
    );
    return run_canceled;
}