import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, addUpdateSettings } from "./hooks.js";

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set passwor for user'],
    },
    email: {
        type: String,
        required: [true, 'Set email for user'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter",
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    avatarURL: String,
    token: String
}, { versionKey: false, timestamps: true });

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', addUpdateSettings);
userSchema.post('findOneAndUpdate', handleSaveError);

export const userSignupSchema = Joi.object({
    password: Joi.string().required().messages({
        'any.required': "missing required pasword field"
    }),
    email: Joi.string().required().messages({
        'any.required': "missing required email field"
    }),
    subscription: Joi.string().valid('starter', 'pro', 'business').messages({
        'any': "invalid subscription value"
    }).default('starter'),
});

export const userSigninSchema = Joi.object({
    password: Joi.string().required().messages({
        'any.required': "missing required pasword field"
    }),
    email: Joi.string().required().messages({
        'any.required': "missing required email field"
    }),
});

export const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').messages({
        'any.required': "subscription field is required"
    }).required(),
});

const User = model('user', userSchema);

export default User;
