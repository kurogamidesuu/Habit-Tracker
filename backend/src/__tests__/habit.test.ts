import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { prisma } from '../lib/prisma';
import app from '../server';

describe('Habit API (Master Suite)', () => {
  let userToken = '';
  const testEmail = 'vitest@test.com';
  
  // Creating a test user and Logging in to get the auth token
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testEmail
      }
    });

    await request(app).post('/user/signup').send({
      username: 'TestUser',
      email: testEmail,
      password: 'password123'
    });

    const loginRes = await request(app).post('/user/login').send({
      email: testEmail,
      password: 'password123'
    });

    userToken = loginRes.body.token;
  });

  // Cleanup after every test
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testEmail
      }
    });
  });

  describe('Basic Habit Endpoints', () => {
    // GET all habits
    it('should return a 400 status when the user has no habits', async () => {
      const res = await request(app)
        .get('/habits')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('No habits yet');
    });

    // Create new habit
    it('should allow the user to create a new habit', async () => {
      const res = await request(app)
        .post('/habits/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Drink Water' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Created habit successfully');
    });
  });

  describe('Streak Logic Math Test', () => {
    let habitId = '';
  
    // Fetch the created habit
    it('should fetch the created habit to get its ID', async () => {
      const getRes = await request(app)
        .get('/habits')
        .set('Authorization', `Bearer ${userToken}`);
      
      habitId = getRes.body.allHabits[0].id;
      expect(habitId).toBeDefined();
    });

    // Complete the habit on Day-1
    it('Day 1: First completion should set the currentStreak to 1', async () => {
      const res = await request(app)
        .patch('/habits/complete')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: habitId, dateString: '2026-05-01' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.updatedHabit.currentStreak).toBe(1);
    });

    // Complete the habit on Day-2 to increase streak
    it('Day 2: Consecutive completion should set the currentStreak to 2', async () => {
      const res = await request(app)
        .patch('/habits/complete')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: habitId, dateString: '2026-05-02' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.updatedHabit.currentStreak).toBe(2);
      expect(res.body.updatedHabit.maxStreak).toBe(2);
    });

    // Trying to complete again on Day-2 even though it is already complete
    it('Day 2 Duplicate: Completing again on the same day should fail', async () => {
      const res = await request(app)
        .patch('/habits/complete')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: habitId, dateString: '2026-05-02' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Habit already completed today');
    });

    // Miss a day and complete on Day-4
    it('Day 4: Missing Day 3 should punish the user and reset the streak to 1', async () => {
      const res = await request(app)
        .patch('/habits/complete')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: habitId, dateString: '2026-05-04' });
      
      expect(res.status).toBe(200);
      expect(res.body.updatedHabit.currentStreak).toBe(1);
      expect(res.body.updatedHabit.maxStreak).toBe(2);
    });
  });
});
