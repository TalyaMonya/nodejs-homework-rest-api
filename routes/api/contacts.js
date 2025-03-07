import express from 'express';
import contactsController from '../../controllers/contacts-controller.js';
import isValidId from '../../middlewares/isValidId.js';
import auth from '../../middlewares/auth.js';
import isEmptyBody from '../../decorators/isEmptyBody.js';
import validateBody from '../../decorators/validateBody.js';
import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from '../../models/contacts.js';
import upload from '../../middlewares/upload.js';

const router = express.Router();

router.use(auth);

router.get('/', contactsController.getContacts);

router.get('/:contactId', isValidId, contactsController.getContactById);

router.post('/', upload.single("avatar"), isEmptyBody('missing fields'), validateBody(contactAddSchema), contactsController.addContact);

router.put('/:contactId', isValidId, isEmptyBody('missing fields'), validateBody(contactUpdateSchema), contactsController.updateContact);

router.patch('/:contactId/favorite', isValidId, isEmptyBody('missing field favorite'), validateBody(contactUpdateFavoriteSchema), contactsController.updateStatusContact);

router.delete('/:contactId', isValidId, contactsController.deleteContact);

export default router;
