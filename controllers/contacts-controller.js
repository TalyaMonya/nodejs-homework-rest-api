import Contact from '../models/contacts.js'
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';


const getContacts = async (req, res, next) => {
    const contacts = await Contact.find();
    res.json(contacts)
};

const getContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
        throw HttpError(404);
    }

    res.json(contact);
}

const addContact = async (req, res, next) => {
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
}

const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const body = req.body;
    const newContact = await Contact.findByIdAndUpdate(contactId, body);
    if (!newContact) {
        throw HttpError(404);
    }

    res.json(newContact);
}

const updateStatusContact = async (req, res, next) => {
    const { contactId } = req.params;
    const body = req.body;
    const newContact = await Contact.findByIdAndUpdate(contactId, body);
    if (!newContact) {
        throw HttpError(404);
    }

    res.json(newContact);
}


const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
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
    updateStatusContact: ctrlWrapper(updateStatusContact),
    deleteContact: ctrlWrapper(deleteContact),
}