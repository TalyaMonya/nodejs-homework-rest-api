import { Schema, model } from "mongoose";
import Joi from "joi";
import { addUpdateSettings, handleSaveError } from "./hooks.js";

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    required: [true, 'Set email for contact'],
  },
  phone: {
    type: String,
    required: [true, 'Set phone for contact'],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  avatarURL: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { versionKey: false, timestamps: true });


contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', addUpdateSettings);
contactSchema.post('findOneAndUpdate', handleSaveError);

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': "missing required name field"
  }),
  email: Joi.string().messages({
    'any.required': "missing required email field"
  }),
  phone: Joi.string().required().messages({
    'any.required': "missing required phone field"
  }),
  favorite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

export const contactUpdateFavoriteSchema = new Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model('contact', contactSchema);
export default Contact;
