import express from "express";
import {signup, login, logout} from "../controllers/user.js"
import { userAuth } from "../middlewares/userAuth.js";

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/logout', userAuth,logout);

export { userRouter };
