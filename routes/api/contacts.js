import express from 'express';
import contactsController from '../../controllers/contacts-controller.js';
import isEmptyBody from '../../middlewares/isEmptyBody.js';
import validateBody from '../../decorators/validateBody.js';
import { contactAddSchema, contactUpdateSchema } from '../../schemas/contact-schemas.js';

const router = express.Router()

router.get('/', contactsController.getContacts);

router.get('/:contactId', contactsController.getContactById);

router.post('/', isEmptyBody, validateBody(contactAddSchema), contactsController.addContact);

router.put('/:contactId', isEmptyBody, validateBody(contactUpdateSchema), contactsController.updateContact);

router.delete('/:contactId', contactsController.deleteContact);

export default router;
