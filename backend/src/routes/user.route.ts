import express, { Router } from "express";
import { changePassword, changeUsername, deleteAccount, getUser, loginUser, registerUser, updatePreferences } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const userRouter: Router = express.Router();

userRouter.post('/signup', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authMiddleware, getUser);
userRouter.put('/preferences', authMiddleware, updatePreferences);
userRouter.patch('/username', authMiddleware, changeUsername);
userRouter.patch('/password', authMiddleware, changePassword);
userRouter.delete('/delete', authMiddleware, deleteAccount);

export default userRouter;