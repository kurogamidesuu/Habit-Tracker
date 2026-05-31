import express from 'express';
import { logout, refresh } from '../controllers/auth.controller';

const authRouter = express.Router();

authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);

export default authRouter;