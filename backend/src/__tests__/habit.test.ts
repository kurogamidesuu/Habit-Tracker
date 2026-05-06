import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { prisma } from '../lib/prisma';
import app from '../server';

describe('Habit API and Streak Logic', () => {
  let userToken = '';
  const testEmail = 'vitest@test.com';

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

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testEmail
      }
    });
  });

  it('should return a 400 status when the user has no habits', async () => {
    const res = await request(app)
      .get('/habits')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('No habits yet');
  });

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