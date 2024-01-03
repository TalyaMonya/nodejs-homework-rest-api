import HttpError from "../helpers/HttpError.js";

const isEmptyBody = message => {
    const func = (req, res, next) => {
        const { length } = Object.keys(req.body);
        if (!length) {
            return next(HttpError(400, message));
        }

        next();
    }

    return func;
}

export default isEmptyBody;