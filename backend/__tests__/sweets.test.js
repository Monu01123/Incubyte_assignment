import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import sweetsRoutes from '../routes/sweets.js';
import { Sweet } from '../models/Sweet.js';
import { User } from '../models/User.js';

// Set JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret';

let mongoServer;
let app;
let testUser;
let adminUser;
let userToken;
let adminToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '6.0.14',
      skipMD5: true,
    },
    instance: {
      dbName: 'test-sweets',
    },
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use('/api/sweets', sweetsRoutes);
}, 300000); // 5 minute timeout for initial MongoDB download on slow connections

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Sweet.deleteMany({});
  await User.deleteMany({});

  // Create test users
  testUser = new User({
    email: 'user@example.com',
    password: 'hashedpassword',
    full_name: 'Test User',
    is_admin: false,
  });
  await testUser.save();

  adminUser = new User({
    email: 'admin@example.com',
    password: 'hashedpassword',
    full_name: 'Admin User',
    is_admin: true,
  });
  await adminUser.save();

  // Create tokens
  userToken = jwt.sign({ userId: testUser._id.toString() }, 'test-secret');
  adminToken = jwt.sign({ userId: adminUser._id.toString() }, 'test-secret');
});

describe('Sweets API - TDD Tests', () => {
  describe('GET /api/sweets', () => {
    it('should return all sweets for authenticated user', async () => {
      // Create test sweets
      await Sweet.create([
        { name: 'Chocolate', category: 'Chocolate', price: 5.99, quantity: 100 },
        { name: 'Gummy Bears', category: 'Gummy', price: 3.99, quantity: 200 },
      ]);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(401);
    });

    it('should return sweets sorted by created_at descending', async () => {
      await Sweet.create([
        { name: 'First', category: 'Test', price: 1, quantity: 1 },
        { name: 'Second', category: 'Test', price: 2, quantity: 2 },
      ]);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body[0].name).toBe('Second');
      expect(response.body[1].name).toBe('First');
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 5.99, quantity: 100 },
        { name: 'Gummy Bears', category: 'Gummy', price: 3.99, quantity: 200 },
        { name: 'Premium Chocolate', category: 'Chocolate', price: 10.99, quantity: 50 },
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.every(s => s.name.toLowerCase().includes('chocolate'))).toBe(true);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Chocolate')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.every(s => s.category === 'Chocolate')).toBe(true);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=5&maxPrice=10')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.every(s => s.price >= 5 && s.price <= 10)).toBe(true);
    });

    it('should combine multiple search parameters', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Chocolate&minPrice=5')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.every(s => s.category === 'Chocolate' && s.price >= 5)).toBe(true);
    });
  });

  describe('POST /api/sweets', () => {
    it('should create a sweet as admin', async () => {
      const newSweet = {
        name: 'New Sweet',
        category: 'Test',
        price: 4.99,
        quantity: 150,
        description: 'Test description',
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newSweet);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newSweet.name);
      expect(response.body.category).toBe(newSweet.category);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'New Sweet',
          category: 'Test',
          price: 4.99,
          quantity: 150,
        });

      expect(response.status).toBe(403);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Sweet',
          // Missing category, price, quantity
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update a sweet as admin', async () => {
      const sweet = await Sweet.create({
        name: 'Original',
        category: 'Test',
        price: 5.99,
        quantity: 100,
      });

      const response = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated',
          price: 7.99,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated');
      expect(response.body.price).toBe(7.99);
    });

    it('should return 403 for non-admin user', async () => {
      const sweet = await Sweet.create({
        name: 'Original',
        category: 'Test',
        price: 5.99,
        quantity: 100,
      });

      const response = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('should delete a sweet as admin', async () => {
      const sweet = await Sweet.create({
        name: 'To Delete',
        category: 'Test',
        price: 5.99,
        quantity: 100,
      });

      const response = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const deleted = await Sweet.findById(sweet._id);
      expect(deleted).toBeNull();
    });

    it('should return 403 for non-admin user', async () => {
      const sweet = await Sweet.create({
        name: 'To Delete',
        category: 'Test',
        price: 5.99,
        quantity: 100,
      });

      const response = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});

