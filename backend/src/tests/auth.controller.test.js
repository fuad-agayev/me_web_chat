import request from 'supertest';
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import app from '../app.js';
import { jest } from '@jest/globals';


jest.setTimeout(20000);


beforeAll(async () => {
  const hashed = await bcrypt.hash("correctpass", 10);
  await pool.query(
    `INSERT INTO users (username, email, password, is_verified)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING`,
    ["fuad", "verified@mail.com", hashed, true]
  );
});

// cleanup şimdilik kaldırılabilir veya sadece pool.end bırakılabilir
// afterAll(async () => { await pool.end(); });

describe('Auth Controller', () => {
  test('register should create user and send email', async () => {
    const uniqueEmail = `fuad_${Date.now()}@mail.com`;

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'fuad', email: uniqueEmail, password: '1234' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(uniqueEmail);
  });

  test('login should fail if user not found', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nouser@mail.com', password: '1234' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('User not found');
  });

  test('login should succeed with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'verified@mail.com', password: 'correctpass' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('logout should clear cookies', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });
});





