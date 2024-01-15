import Contact from '../models/contacts.js'
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import fs from "fs/promises";
import path from 'path';

const avatarPath = path.resolve("public", "avatars");

const getContacts = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 5, favorite } = req.query;

    const skip = (page - 1) * limit;
    const query = { owner };
    if (favorite) {
        query.favorite = true;
    }

    const contacts = await Contact.find(query, "", {skip,limit}).populate('owner', 'email');
    res.json(contacts)
};

const getContactById = async (req, res, next) => {
    const { contactId: _id } = req.params;
    const { _id: owner } = req.user;
    const contact = await Contact.findOne({_id: owner});
    if (!contact) {
        throw HttpError(404);
    }

    res.json(contact);
}

// const addContact = async (req, res, next) => {
//     const { _id: owner } = req.user;
//     const newContact = await Contact.create({ ...req.body, owner });
//     res.status(201).json(newContact);
// }

const addContact = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename)

    const newContact = await Contact.create({ ...req.body, avatarURL, owner });
    res.status(201).json(newContact);
}

const updateContact = async (req, res, next) => {
    const { contactId: _id } = req.params;
    const {_id: owner} = req.user;
    const newContact = await Contact.findOneAndUpdate({_id, owner}, req.body);
    if (!newContact) {
        throw HttpError(404);
    }

    res.json(newContact);
}

const updateStatusContact = async (req, res, next) => {
    const { contactId: _id } = req.params;
    const {_id: owner} = req.user;
    const newContact = await Contact.findOneAndUpdate({_id, owner}, req.body);
    if (!newContact) {
        throw HttpError(404);
    }

    res.json(newContact);
}


const deleteContact = async (req, res, next) => {
    const { contactId: _id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndDelete({_id, owner});
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