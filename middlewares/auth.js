import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";

const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(HttpError(401, 'Not authorized'));
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer !== "Bearer") {
        return next(HttpError(401, 'Not authorized'));
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);

        if (!user || !user.token || token !== user.token) {
            return next(HttpError(401, 'Not authorized'));
        }

        req.user = user;
        next();
    } catch {
        next(HttpError(401, 'Not authorized'));
    }
};

export default auth;