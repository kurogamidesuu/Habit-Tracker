import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { saveSubscription, sendTestNotification } from "../controllers/push.controller";

const pushRouter: Router = express.Router();

pushRouter.post('/subscribe', authMiddleware, saveSubscription);
pushRouter.post('/test', authMiddleware, sendTestNotification);

export default pushRouter;