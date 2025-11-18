# Sweet Shop Management System — TDD Kata

A full-stack Sweet Shop Management System built using **Test-Driven Development (TDD)**, clean coding practices, and a transparent AI-assisted development workflow. This project demonstrates modern web development practices including React frontend, Express.js backend, MongoDB database, and comprehensive testing.

## 🎯 Project Overview

This project is a complete end-to-end demonstration of a **Sweet Shop Management System**. Users can browse sweets, purchase items, and admins can manage inventory. The system showcases:

- **Full-stack architecture** with React frontend and Express.js backend
- **MongoDB database** for data persistence
- **JWT-based authentication** with secure token management
- **Test-Driven Development** workflow (Red → Green → Refactor)
- **Clean coding practices** following SOLID principles
- **API-first design** with RESTful endpoints
- **Responsive UI** with modern design patterns

## Project Structure

```
sweet-shop/
├── backend/              # Express.js + MongoDB backend
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB models (User, Sweet, Transaction)
│   ├── routes/          # API routes (auth, sweets, inventory)
│   ├── middleware/      # Authentication middleware
│   └── server.js         # Express server entry point
├── src/                 # React frontend
│   ├── components/      # React components
│   ├── context/         # React context (Auth)
│   ├── services/        # API service layer
│   ├── utils/           # Utility functions
│   └── pages/           # Page components
└── package.json         # Frontend dependencies
```

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Lucide React** for icons

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On macOS/Linux
mongod

# On Windows, start MongoDB service or use MongoDB Compass
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is taken)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password

### Sweets Management
- `GET /api/sweets` - Get all sweets (requires auth)
- `GET /api/sweets/search` - Search sweets (requires auth)
- `POST /api/sweets` - Create a sweet (Admin only)
- `PUT /api/sweets/:id` - Update a sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory Operations
- `POST /api/inventory/sweets/:id/purchase` - Purchase a sweet (requires auth)
- `POST /api/inventory/sweets/:id/restock` - Restock inventory (Admin only)

## Database Schema

### User
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  full_name: String (required),
  is_admin: Boolean (default: false),
  created_at: Date
}
```

### Sweet
```javascript
{
  name: String (required),
  category: String (required),
  price: Number (required, min: 0),
  quantity: Number (required, min: 0),
  description: String,
  image_url: String,
  created_at: Date,
  updated_at: Date
}
```

### Transaction
```javascript
{
  sweet_id: ObjectId (ref: Sweet),
  user_id: ObjectId (ref: User),
  transaction_type: String (enum: ['purchase', 'restock']),
  quantity: Number (required, min: 1),
  created_at: Date
}
```

## Features

- ✅ User authentication with JWT
- ✅ Role-based access control (Admin/Customer)
- ✅ Sweet inventory management
- ✅ Purchase and restock operations
- ✅ Search and filter sweets
- ✅ Transaction history tracking
- ✅ Responsive UI design

## Creating an Admin User

To create an admin user, you can use the provided script:

1. First, register a user through the frontend or API
2. Then run the admin creation script:
```bash
cd backend
npm run create-admin <user-email>
```

Example:
```bash
npm run create-admin admin@example.com
```

Alternatively, you can use MongoDB directly:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { is_admin: true } }
)
```

## Development

### Backend
- Run in development mode: `npm run dev` (with auto-reload)
- Run in production mode: `npm start`

### Frontend
- Development: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Testing

This project follows **Test-Driven Development (TDD)** principles with a Red-Green-Refactor workflow.

### Running Tests

**Backend Tests:**
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

**Frontend Tests:**
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Test Coverage

The project includes comprehensive test coverage for:
- ✅ Authentication (register, login, validation)
- ✅ Sweets CRUD operations (with admin checks)
- ✅ Inventory operations (purchase, restock)
- ✅ Authorization and middleware
- ✅ Error handling
- ✅ Data validation

### Test Report

To generate a test report:

```bash
# Backend
cd backend
npm run test:coverage

# Frontend
npm run test:coverage
```

Coverage reports will be generated in:
- Backend: `backend/coverage/`
- Frontend: `coverage/`

## Notes

- The backend uses MongoDB ObjectIds which are automatically converted to strings in API responses
- JWT tokens are stored in localStorage on the frontend
- All API routes (except auth) require a valid JWT token in the Authorization header
- Admin routes require both authentication and the `is_admin` flag to be true

## My AI Usage

### AI Tools Used

Throughout the development of this project, I utilized **Cursor AI** (powered by Claude) as my primary AI coding assistant. This tool was integrated directly into my development environment and provided real-time code suggestions, debugging assistance, and architectural guidance.

### How AI Was Used

1. **Initial Project Setup & Architecture**
   - Used AI to brainstorm the overall project structure and decide on the separation of frontend and backend
   - Asked for recommendations on technology stack choices (Express.js, MongoDB, React, etc.)
   - Generated initial boilerplate code for Express server setup and MongoDB connection

2. **Database Setup (MongoDB)**
   - Leveraged AI to help convert PostgreSQL schema to MongoDB/Mongoose schemas
   - Used AI to understand how to properly implement Express middleware for authentication
   - Got assistance in converting UUID-based IDs to MongoDB ObjectIds with proper string conversion

3. **Test-Driven Development**
   - Used AI to generate initial test structures following TDD patterns
   - Asked AI to help write test cases for edge cases I might have missed
   - Used AI to understand best practices for testing Express routes with Supertest
   - Got help setting up MongoDB Memory Server for isolated test environments

4. **Code Generation & Boilerplate**
   - Generated Express route handlers with proper error handling patterns
   - Created MongoDB models with validation and transformation logic
   - Generated JWT authentication middleware
   - Created token storage utilities for frontend

5. **Debugging & Problem Solving**
   - Used AI to debug authentication issues when implementing custom JWT
   - Got help fixing RLS policy problems that were blocking customer purchases
   - Used AI to understand and fix MongoDB ObjectId serialization issues

6. **Documentation**
   - Used AI to help structure the README.md file
   - Got suggestions for documenting API endpoints
   - Used AI to write clear setup instructions

7. **Code Refactoring**
   - Asked AI for suggestions on improving code organization
   - Used AI to identify potential security issues in authentication flow
   - Got recommendations on following SOLID principles

### Reflection on AI Impact

**Positive Impacts:**
- **Speed**: AI significantly accelerated development, especially for boilerplate code and repetitive patterns
- **Learning**: AI explanations helped me understand MongoDB/Mongoose patterns I wasn't familiar with
- **Quality**: AI caught several potential bugs early, especially around authentication and authorization
- **Best Practices**: AI suggestions helped maintain consistent code style and follow industry standards

**Challenges & Learning:**
- **Over-reliance**: Initially, I found myself accepting AI suggestions without fully understanding them. I learned to always review and understand AI-generated code before committing
- **Context Management**: AI sometimes lost context in long conversations, requiring me to re-explain requirements
- **Testing**: While AI helped generate test structures, I had to manually ensure tests actually validated business logic correctly

**Responsible Usage:**
- I never blindly copied AI-generated code without understanding it
- All AI suggestions were reviewed, tested, and modified to fit the project's specific needs
- I used AI as a tool to augment my development, not replace my problem-solving skills
- All commits where AI was significantly used include proper co-author attribution

**Key Takeaway:**
AI was most valuable when used as a collaborative pair-programming partner rather than a code generator. The best results came from:
1. Clearly defining requirements myself
2. Using AI to generate initial implementations
3. Reviewing and understanding the generated code
4. Testing and refining based on actual behavior
5. Iterating with AI on improvements

This workflow maintained my understanding of the codebase while leveraging AI's ability to generate boilerplate and suggest patterns I might not have considered.

## Screenshots

> **Note**: Screenshots should be added here showing:
> - Login/Registration pages
> - Dashboard with sweets display
> - Search and filter functionality
> - Admin panel for managing sweets
> - Purchase flow
> - Responsive design on mobile devices

To add screenshots, place them in an `img/` or `screenshots/` directory and reference them here.

## Deliverables Checklist

- ✅ Public Git repository (ready for GitHub/GitLab)
- ✅ Comprehensive README.md with:
  - ✅ Clear project explanation
  - ✅ Detailed setup instructions
  - ✅ API endpoint documentation
  - ✅ Database schema documentation
  - ✅ **"My AI Usage" section** (mandatory)
  - ⏳ Screenshots section (add screenshots)
- ✅ Comprehensive test coverage with Jest and Vitest
- ⏳ Deployed application (optional - can be added later)

## Git Commit Guidelines

When committing code where AI was used, include co-author attribution:

```bash
git commit -m "feat: Implement user registration endpoint

Used an AI assistant to generate the initial boilerplate for the
controller and service, then manually added validation logic.

Co-authored-by: Cursor AI <cursor@users.noreply.github.com>"
```

## License

This project is part of a TDD Kata assignment.
