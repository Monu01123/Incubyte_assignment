import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import inventoryRoutes from '../routes/inventory.js';
import { Sweet } from '../models/Sweet.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';

// Set JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret';

let mongoServer;
let app;
let testUser;
let adminUser;
let userToken;
let adminToken;
let testSweet;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '6.0.14',
      skipMD5: true,
    },
    instance: {
      dbName: 'test-inventory',
    },
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use('/api/inventory', inventoryRoutes);
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
  await Transaction.deleteMany({});

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

  // Create test sweet
  testSweet = await Sweet.create({
    name: 'Test Sweet',
    category: 'Test',
    price: 5.99,
    quantity: 100,
  });

  // Create tokens
  userToken = jwt.sign({ userId: testUser._id.toString() }, 'test-secret');
  adminToken = jwt.sign({ userId: adminUser._id.toString() }, 'test-secret');
});

describe('Inventory API - TDD Tests', () => {
  describe('POST /api/inventory/sweets/:id/purchase', () => {
    it('should purchase a sweet and decrease quantity', async () => {
      const initialQuantity = testSweet.quantity;
      const purchaseQuantity = 5;

      const response = await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: purchaseQuantity });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Purchase successful');
      expect(response.body.sweet.quantity).toBe(initialQuantity - purchaseQuantity);

      // Verify quantity was updated in database
      const updatedSweet = await Sweet.findById(testSweet._id);
      expect(updatedSweet.quantity).toBe(initialQuantity - purchaseQuantity);
    });

    it('should create a transaction record', async () => {
      const purchaseQuantity = 3;

      await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: purchaseQuantity });

      const transaction = await Transaction.findOne({
        sweet_id: testSweet._id,
        user_id: testUser._id,
        transaction_type: 'purchase',
      });

      expect(transaction).toBeTruthy();
      expect(transaction.quantity).toBe(purchaseQuantity);
    });

    it('should return 400 if quantity is zero or negative', async () => {
      const response = await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 0 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if quantity exceeds available stock', async () => {
      const response = await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1000 });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Insufficient quantity');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/purchase`)
        .send({ quantity: 5 });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/inventory/sweets/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/inventory/sweets/:id/restock', () => {
    it('should restock a sweet and increase quantity as admin', async () => {
      const initialQuantity = testSweet.quantity;
      const restockQuantity = 50;

      const response = await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: restockQuantity });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Restock successful');
      expect(response.body.sweet.quantity).toBe(initialQuantity + restockQuantity);

      // Verify quantity was updated in database
      const updatedSweet = await Sweet.findById(testSweet._id);
      expect(updatedSweet.quantity).toBe(initialQuantity + restockQuantity);
    });

    it('should create a transaction record for restock', async () => {
      const restockQuantity = 30;

      await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: restockQuantity });

      const transaction = await Transaction.findOne({
        sweet_id: testSweet._id,
        user_id: adminUser._id,
        transaction_type: 'restock',
      });

      expect(transaction).toBeTruthy();
      expect(transaction.quantity).toBe(restockQuantity);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Admin access required');
    });

    it('should return 400 if quantity is zero or negative', async () => {
      const response = await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post(`/api/inventory/sweets/${testSweet._id}/restock`)
        .send({ quantity: 50 });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/inventory/sweets/${fakeId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(404);
    });
  });
});

