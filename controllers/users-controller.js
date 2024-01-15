import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import User from '../models/user.js';
import "dotenv/config";
import fs from "fs/promises";
import path from 'path';
import gravatar from "gravatar";
import Jimp from 'jimp';

const { JWT_SECRET } = process.env;
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
    const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword });

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription
        }
    });
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
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
};