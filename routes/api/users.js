import express from "express";
import isEmptyBody from "../../decorators/isEmptyBody.js";
import validateBody from "../../decorators/validateBody.js";
import { updateSubscriptionSchema, userEmailSchema, userSigninSchema, userSignupSchema } from "../../models/user.js";
import usersController from "../../controllers/users-controller.js";
import auth from "../../middlewares/auth.js";
import upload from "../../middlewares/upload.js";


const router = express.Router();

router.post('/register', isEmptyBody('missing fields'), validateBody(userSignupSchema), usersController.signup);

router.post('/login', isEmptyBody('missing fields'), validateBody(userSigninSchema), usersController.signin);

router.post('/logout', auth, usersController.signout);

router.get('/current', auth, usersController.getCurrent);

router.patch('/', auth, validateBody(updateSubscriptionSchema), usersController.updateSubscription);

router.patch('/avatar', upload.single("avatar"), auth, usersController.updateAvatar);

router.get("/verify/:verificationCode", usersController.verify);

router.post("/verify", isEmptyBody('missing fields'), validateBody(userEmailSchema), usersController.resendVerifyEmail)

export default router;