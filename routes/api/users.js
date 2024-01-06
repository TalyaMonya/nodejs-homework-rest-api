import express from "express";
import isEmptyBody from "../../decorators/isEmptyBody.js";
import validateBody from "../../decorators/validateBody.js";
import { updateSubscriptionSchema, userSigninSchema, userSignupSchema } from "../../models/user.js";
import usersController from "../../controllers/users-controller.js";
import auth from "../../middlewares/auth.js";


const router = express.Router();

router.post('/register', isEmptyBody('missing fields'), validateBody(userSignupSchema), usersController.signup);

router.post('/login', isEmptyBody('missing fields'), validateBody(userSigninSchema), usersController.signin);

router.post('/logout', auth, usersController.signout);

router.get('/current', auth, usersController.getCurrent);

router.patch('/', auth, validateBody(updateSubscriptionSchema), usersController.updateSubscription);

export default router;