import express from 'express';
import { googleCallback, logout, refresh } from '../controllers/auth.controller';
import passport from '../lib/passport';

const authRouter = express.Router();

authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));
authRouter.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: `${process.env.FRONTEND_URL}/login`,
}), googleCallback);

export default authRouter;