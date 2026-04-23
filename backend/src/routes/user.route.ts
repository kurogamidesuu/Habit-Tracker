import express, { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const userRouter: Router = express.Router();

userRouter.post('/signup', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;