import express, { Router } from 'express';
import { addHabit, getHabits, removeHabit } from '../controllers/habit.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const habitRouter: Router = express.Router();

habitRouter.get('/', authMiddleware, getHabits);
habitRouter.post('/add', authMiddleware, addHabit);
habitRouter.delete('/remove', authMiddleware, removeHabit);

export default habitRouter;