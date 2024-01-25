import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import sendEmail from '../helpers/sendEmail.js';
import User from '../models/user.js';
import "dotenv/config";
import fs from "fs/promises";
import path from 'path';
import gravatar from "gravatar";
import Jimp from 'jimp';

const { JWT_SECRET, BASE_URL } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const updateAvatar = async (req, res, next) => {
        if (!req.file) {
            throw HttpError(400, "missing file");
        }
        const { path: oldPath, filename } = req.file;
        const newPath = path.join(avatarsPath, filename);
        Jimp.read(oldPath)
            .then((image) => {
                image.resize(250, 250).write(newPath);
            }).catch((err) => {
                console.log(err);
            });
        await fs.rename(oldPath, newPath);

        const avatarURL = path.join("avatars", filename);
        const { _id } = req.user;
        const result = await User.findByIdAndUpdate(_id, { avatarURL });
        if (!result) {
            throw HttpError(404);
        }
        res.json({ avatarURL });
};

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid();

    const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword, verificationCode});

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click to verify your email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription
        }
    });
};

const verify = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });

    if (!user) {
        throw HttpError(400, "Email not found or already verify");
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: "" });

    res.json({
        message: "Email verify success"
    })
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        throw HttpError(404, "Email not found");
    }
    if(user.verify) {
        throw HttpError(400, "Email already verify");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify your email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    });

};

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const { _id: id } = user;
    const payload = {
        id,
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token });

    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription
        }
    });
};

const signout = async (req, res) => {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, { token: "" });

    res.status(204).json();
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
};

const updateSubscription = async (req, res) => {
    const { _id: id } = req.user;
    const { subscription } = req.body;
    const user = await User.findByIdAndUpdate(id, { subscription });

    res.json({
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    });
};


export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    signout: ctrlWrapper(signout),
    getCurrent: ctrlWrapper(getCurrent),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};