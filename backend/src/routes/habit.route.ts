import express, { Router } from 'express';
import { addHabit, getHabits, removeHabit } from '../controllers/habit.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const habitRouter: Router = express.Router();

habitRouter.get('/', authMiddleware, getHabits);
habitRouter.post('/add', authMiddleware, addHabit);
habitRouter.delete('/remove', authMiddleware, removeHabit);

export default habitRouter;