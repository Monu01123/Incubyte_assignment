# Sweet Shop Management System — TDD Kata

A full-stack Sweet Shop Management System built with **Test-Driven Development (TDD)**, clean code principles, and transparent AI assistance. This project demonstrates modern web development practices including React frontend, Supabase backend, PostgreSQL database, and comprehensive testing.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)
- [Test Report](#test-report)

---

## Project Overview

This project is a complete end-to-end demonstration of a **Sweet Shop Management System**. Users can browse sweets, purchase items, and admins can manage inventory. The system showcases:

- **Full-stack architecture** with React frontend and Supabase backend
- **Authentication system** with secure JWT-based tokens
- **Database design** with proper schema and Row Level Security (RLS)
- **Test-Driven Development** workflow (Red → Green → Refactor)
- **Clean coding practices** following SOLID principles
- **API-first design** with RESTful endpoints
- **Responsive UI** with modern design patterns

---

## Core Features

### Backend API (REST)

#### Authentication
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login with email/password (returns JWT)

#### Sweets Management (Protected / Admin)
- `POST /sweets` – Add a new sweet (Admin only)
- `GET /sweets` – Get all available sweets
- `GET /sweets/search` – Search sweets by name, category, or price
- `PUT /sweets/:id` – Update sweet details (Admin only)
- `DELETE /sweets/:id` – Delete a sweet (Admin only)

#### Inventory Operations (Protected)
- `POST /sweets/:id/purchase` – Purchase a sweet, decrease quantity
- `POST /sweets/:id/restock` – Restock inventory (Admin only)

**Sweet Data Model:**
```typescript
{
  id: string,
  name: string,
  category: string,
  price: number,
  quantity: number,
  description?: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Frontend Application (SPA)

Built with React + TypeScript for a modern, reactive user experience:

- **User Authentication** – Secure login and registration forms
- **Dashboard** – Display all available sweets with real-time inventory
- **Search & Filter** – Find sweets by name, category, or price range
- **Purchase System** – One-click purchasing with quantity management
- **Admin Panel** – CRUD operations for sweet management
- **Responsive Design** – Works seamlessly on mobile, tablet, and desktop
- **Error Handling** – Clear user feedback for all operations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Backend** | Supabase Edge Functions + REST API |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth (JWT) |
| **UI Components** | TailwindCSS + Lucide Icons |
| **Testing** | Vitest + React Testing Library |
| **Deployment** | Vercel / Netlify (optional) |

---

## Project Structure

```
sweet-shop/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── Sweets/
│   │       ├── SweetCard.tsx
│   │       ├── SearchBar.tsx
│   │       └── SweetFormModal.tsx
│   ├── context/
│   │   └── AuthContext.tsx          # Authentication state management
│   ├── services/
│   │   ├── api.ts                   # API client methods
│   │   └── supabase.ts              # Supabase client setup
│   ├── pages/
│   │   └── Dashboard.tsx
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── tests/
│   │   └── AuthContext.test.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── functions/                   # Edge Functions
│   │   ├── auth/index.js
│   │   ├── sweets/index.ts
│   │   └── inventory/index.ts
│   └── migrations/                  # Database migrations
│       └── 20251113163408_create_sweet_shop_schema.sql
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git

### Step 1: Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd sweet-shop
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xfazxutluwbpsbtnuibm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYXp4dXRsdXdicHNidG51aWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTA1NDEsImV4cCI6MjA3ODYyNjU0MX0.g1Y245RCTuyrWDAwVlLiVL3YCOVbeiXQUO0jAuyHZ_Q
```

**Note:** These credentials are already provided. Do not commit `.env` files to version control.

### Step 3: Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Step 4: Run Tests

```bash
npm run test
```

### Step 5: Build for Production

```bash
npm run build
```

### Optional: Deploy

To deploy the application to production:

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## Development Workflow

### TDD (Test-Driven Development)

This project follows the **Red → Green → Refactor** pattern:

**🔴 RED:** Write failing tests first
```typescript
// Example: AuthContext.test.ts
test('should authenticate user with valid credentials', () => {
  // This test fails initially
});
```

**🟢 GREEN:** Write minimal code to pass tests
```typescript
// Implement just enough to make the test pass
const login = async (email, password) => {
  // Basic implementation
};
```

**🟡 REFACTOR:** Clean and improve
```typescript
// Optimize, add error handling, improve naming
const authenticateUser = async (credentials: LoginCredentials) => {
  // Enhanced implementation
};
```

### Git Workflow with AI Co-authorship

When using AI tools, add co-authors to commits:

```bash
git commit -m "feat: Implement sweet purchase endpoint

Used Claude to generate boilerplate for the purchase logic.
Manually added validation and error handling.

Co-authored-by: Claude <claude@anthropic.com>"
```

---

## Testing

### Running Tests

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run typecheck        # TypeScript type checking
```

### Test Coverage

Currently testing:
- **AuthContext** – Authentication state and user session management
- **API Services** – Data fetching and mutation operations
- **Component Logic** – User interactions and form submissions

---

## API Endpoints

### Authentication

```bash
# Register
curl -X POST http://localhost:5173/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5173/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Sweets Management

```bash
# Get all sweets
curl -X GET http://localhost:5173/sweets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search sweets
curl -X GET "http://localhost:5173/sweets/search?q=chocolate" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add sweet (Admin only)
curl -X POST http://localhost:5173/sweets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Chocolate Bar",
    "category":"Chocolate",
    "price":5.99,
    "quantity":100
  }'
```

---

## Screenshots

Add your application screenshots here:

- **Login Page** – User authentication interface
![Screenshot](https://drive.google.com/file/d/1UZ0S9sUn-F9SbJUESr38mfjPLtTPAWy9/view?usp=sharing)
- **Dashboard** – Sweets listing and search
- **Purchase Modal** – Sweet purchase flow
- **Admin Panel** – CRUD operations for inventory management

(Screenshots to be added)

---

## My AI Usage

This project was developed with transparent AI assistance, as per the kata requirements.

### AI Tools Used

1. **Claude AI** (Anthropic)
   - Code generation and debugging
   - Architecture planning
   - Test writing and refactoring suggestions
   - Documentation and README structure

2. **GitHub Copilot**
   - Boilerplate code completion
   - Function implementation suggestions
   - Type definitions and interfaces

### How AI Was Used

| Task | AI Tool | Notes |
|------|---------|-------|
| API endpoint design | Claude | Discussed RESTful conventions and best practices |
| TDD test generation | Claude | Generated initial failing tests for auth flow |
| Component scaffolding | Copilot | Auto-completed React component structure |
| Database schema | Claude | Designed tables with RLS policies |
| Error handling | Claude | Added comprehensive error handling patterns |
| Documentation | Claude | Structured README and inline comments |
| Debugging | Claude | Identified bugs in authentication logic |

### Reflection on AI Impact

**Positive impacts:**
- Significantly reduced boilerplate writing time
- Improved code consistency and readability
- Helped identify edge cases during testing
- Accelerated documentation and knowledge sharing

**How I used AI responsibly:**
- Always reviewed and understood generated code before using
- Modified and customized suggestions to fit project needs
- Combined AI suggestions with my own logic and design
- Maintained code quality standards throughout
- Transparent about AI usage in commits and documentation

**Key learnings:**
- AI is most effective for scaffolding and ideation, not core logic
- Manual review of AI code is essential for security and quality
- AI works best when given clear context and requirements

---

## Clean Coding Practices

This project adheres to the following principles:

### SOLID Principles
- **Single Responsibility:** Each component/function has one reason to change
- **Open/Closed:** Code is open for extension, closed for modification
- **Liskov Substitution:** Components can be substituted without breaking functionality
- **Interface Segregation:** Minimal, focused interfaces
- **Dependency Inversion:** Depend on abstractions, not concrete implementations

### Code Quality
- **Meaningful Names** – Variables and functions clearly indicate purpose
- **DRY (Don't Repeat Yourself)** – No code duplication
- **Small Functions** – Each function does one thing well
- **Error Handling** – Comprehensive, predictable error management
- **Comments** – Only where necessary, code should be self-documenting

### Resources
- [Martin Fowler - Clean Code](https://martinfowler.com/)
- [SOLID Principles - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html)
- [TDD Best Practices](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

## Test Report

### Current Test Results

```
 PASS  src/tests/AuthContext.test.ts
 PASS  src/tests/api.test.ts

 Test Files  2 passed (2)
      Tests  10 passed (10)
   Start at  0.38s
   Duration  1.28s
```

### Test Coverage Areas

- Authentication (login, registration, logout)
- API calls (fetch, error handling)
- State management (context updates)
- Component interactions (user actions)

### Running Tests

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
```

---

## Common Issues & Troubleshooting

### Environment Variables Not Loading
- Ensure `.env` file is in the root directory
- Restart the dev server after updating `.env`
- Check variable names match exactly (case-sensitive)

### Authentication Errors
- Verify Supabase URL and anon key are correct
- Check user exists in Supabase Auth dashboard
- Ensure JWT token is valid and not expired

### Database Connection Issues
- Confirm Supabase project is active and running
- Check RLS policies allow the operation
- Review Supabase dashboard for error logs

---

## Contributing

When contributing to this project:

1. Create a new branch: `git checkout -b feature/your-feature`
2. Write tests first (TDD approach)
3. Implement the feature
4. Add AI co-authors if used: `git commit -m "..." --trailer="Co-authored-by: AI Tool <email>"`
5. Submit a pull request

---

## License

This project is part of the TDD Kata challenge and is intended for educational purposes.

---

## Resources & References

- **TDD:** https://martinfowler.com/bliki/TestDrivenDevelopment.html
- **Clean Code:** https://www.freecodecamp.org/news/clean-coding-for-beginners/
- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **Vitest:** https://vitest.dev/
- **GitHub Co-authorship:** https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-a-commit-with-multiple-authors

---

**Last Updated:** November 16, 2024
**Status:** In Development