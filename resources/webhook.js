const axios = require('axios');

// Replace 'your_webhook_url' with the actual URL where you want to send the webhook
const webhookUrl = 'https://example.com/your-webhook-endpoint';

// Replace 'your_data' with the data you want to send in the webhook payload
const webhookData = {
  key1: 'value1',
  key2: 'value2',
  // ... add more data as needed
};

// Send a POST request to the webhook URL with the data
axios.post(webhookUrl, webhookData)
  .then(response => {
    console.log('Webhook sent successfully:', response.data);
  })
  .catch(error => {
    console.error('Error sending webhook:', error.message);
  });
