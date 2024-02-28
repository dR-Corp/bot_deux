// Class for whatsapp.js client

class Whatsapp {
    constructor() {
        this.client = new Client();
    }
    // initialize the client
    initialize() {
        this.client.initialize();
    }
}