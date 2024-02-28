const wwebjs_client = require('../wwebjs');
const assistant_client = require('../assistant');
const contacts = require('../contacts');

// SEND MESSAGE
exports.sendMessage = async (req, res, next) => {

    // On crée un thread lorsqu'on envoie un premier message au user après qu'il est passé commande
    // (la route send message est concernée) et on y enregistre le contact (s'il n'exsiste pas) et on lui associe son nouveau thread

    console.log(req.body);
    const {id, name, phone, address, email, product, date} = req.body;
    let message = "";
    let infos = {
        "infos_connues": {id, name, phone, address, email, product, date, status: "En attente de confimation de la commande"}
    }

    if(!isNaN(phone)) {

        message = `Bonjour`;
        if(name.length > 0) 
            message += ` ${name}.\n`;

        if(address.length > 0) {
            message += `Merci pour votre commande de la Magic Brush sur notre boutique en ligne. Votre adresse de livraison c'est bien ${address}. Je m'occupe de confirmer les heures de livraison des commandes, pourriez vous m'indiquer votre disponibilite pour la livraison ? `;
        }
        else {
            message += `Merci pour votre commande de la Magic Brush sur notre boutique en ligne. Je m'occupe de confirmer les heures de livraison des commandes, pourriez vous m'indiquer votre adresse ainsi que votre disponibilite pour la livraison ? `;
        }

        // on envoi un premier message au customer
        await wwebjs_client.sendMessage(`${phone}@c.us`, message);

        const thread = await assistant_client.create_thread();
        
        // on verra après si la ligne doit rester, avec assistant ça ne marche pas
        // Informations connues à indiquer comme base aussi !
        // **************
        const user_infos = await assistant_client.add_message(thread, role="user", content=JSON.stringify(infos));
        const user_message = await assistant_client.add_message(thread, role="user", content=message);

        // enregistrer le contact (s'il n'existe pas encore), et assigner le thread_id (mm s'il y en avait un)
        const contact = {id, name, phone, address, email, product, date, thread_id: thread.id};
        if(contacts.get_contact(phone)) {
            contacts.update_contact(contact);
        }
        else {
            contacts.add_contact(contact);
        }

        await res.status(201).json({
            alert: "success",
            message: 'Message sended'
        });
    }
    else {
        res.status(201).json({
            alert: "error",
            message: 'Invalid phone number'
        });
    }
    
}

// GET ALL MESSAGES
exports.getAllMessage = (req, res, next) => {
    const stuff = [
        {
            _id: 'oeihfzeoi',
            title: 'Mon premier objet',
            description: 'Les infos de mon premier objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userId: 'qsomihvqios',
        },
        {
            _id: 'oeihfzeomoihi',
            title: 'Mon deuxième objet',
            description: 'Les infos de mon deuxième objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userId: 'qsomihvqios',
        },
    ];
    res.status(200).json(stuff);
}