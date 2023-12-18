import * as contactsService from '../models/contacts.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';


const getContacts = async (req, res, next) => {
    const contacts = await contactsService.listContacts();
    res.json(contacts)
};

const getContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);
    if (!contact) {
        throw HttpError(404);
    }

    res.json(contact);
}

const addContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
}

const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const body = req.body;
    const newContact = await contactsService.updateContact(contactId, body);
    if (!newContact) {
        throw HttpError(404);
    }

    res.json(newContact);
}

const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
    if (!result) {
        throw HttpError(404);
    }

    res, json({ "message": "contact deleted" });
}


export default {
    getContacts: ctrlWrapper(getContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    deleteContact: ctrlWrapper(deleteContact),
}