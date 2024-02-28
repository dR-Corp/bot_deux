const fs = require('fs');

const read_contacts = () => {
    try {
        const contacts = fs.readFileSync('contacts.json', 'utf8');
        return JSON.parse(contacts);
    } catch (err) {
        console.log(err);
        return [];
    }
}

const write_contacts = (contacts) => {
    try {
        fs.writeFileSync('contacts.json', JSON.stringify(contacts, null, 2), 'utf8')
    } catch (err) {
        console.log("An error occur while writting contacts");
    }
}

exports.add_contact = (contact) => {
    const contacts = read_contacts();
    contacts.push(contact);
    write_contacts(contacts);
}

exports.update_contact = (new_contact) => {
    const contacts = read_contacts();
    const contact_index = contacts.findIndex(contact => contact.phone === new_contact.phone);
    if(contact_index !== 1) {
        contacts[contact_index] = new_contact;
        write_contacts(contacts);
    }
}

exports.get_contact = (phone) => {
    const contacts = read_contacts();
    return contacts.find(contact => contact.phone === phone);
}