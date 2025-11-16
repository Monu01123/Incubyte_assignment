🍬 Sweet Shop Management System — TDD Kata

A full-stack Sweet Shop Management System built using TDD (Test-Driven Development), clean coding practices, and a transparent AI-assisted development workflow.

🚀 Project Overview

This project is a complete end-to-end Sweet Shop Management System designed to demonstrate:

API development

Database schema design

Authentication system

Protected API routes

SPA frontend

TDD workflows (Red → Green → Refactor)

Transparent AI usage

The system supports managing sweets, handling purchases, restocking, and admin-only features such as sweet creation & deletion.

🧠 Core Features
1️⃣ Backend API (REST)

Backend includes:

Authentication

POST /api/auth/register – Register user

POST /api/auth/login – Login (JWT-based)

Sweets Management (Protected / Admin)

POST /api/sweets – Add sweet

GET /api/sweets – Get sweets

GET /api/sweets/search – Search sweets

PUT /api/sweets/:id – Update sweet

DELETE /api/sweets/:id – Delete sweet (Admin only)

Inventory Operations (Protected)

POST /api/sweets/:id/purchase

POST /api/sweets/:id/restock (Admin only)

Each sweet includes:

id, name, category, price, quantity

2️⃣ Frontend Application (SPA)

Built using a modern frontend framework (React in your case):

✔ User Registration & Login
✔ Dashboard showing all sweets
✔ Search & filtering
✔ Purchase button that disables when quantity = 0
✔ Admin UI for CRUD operations
✔ Fully responsive design

📂 Tech Stack
Layer	Technology
Frontend	React + TypeScript + Vite
Backend	Supabase Edge Functions / REST
Database	Supabase (PostgreSQL)
Testing	Vitest (frontend)
Deployment	(Add if deployed)
🧪 Test-Driven Development (TDD)

This project follows the Red → Green → Refactor workflow:

🔴 RED

Write failing tests first
(Example: AuthContext.test.ts initially fails)

🟢 GREEN

Write minimal code to pass the tests
(Example: Basic AuthContext implementation)

🟡 REFACTOR

Clean the code
(Example: Improve naming, remove duplication)

Your commit history reflects this pattern.

📚 Reference:
TDD principles (Martin Fowler): https://martinfowler.com/bliki/TestDrivenDevelopment.html

Vitest testing framework: https://vitest.dev/

🧼 Clean Coding Practices

This project follows:

Meaningful variable and function names

Single Responsibility Principle (SRP)

Modular folder structure

Minimal API surface

Avoiding duplication (DRY)

Predictable, consistent error handling

📚 Reference: Clean Code Basics – freeCodeCamp
https://www.freecodecamp.org/news/clean-coding-for-beginners/

📦 Project Structure
incubyte/
 ├── src/
 │   ├── components/
 │   ├── context/
 │   ├── services/
 │   ├── tests/
 │   └── pages/
 ├── supabase/
 │   ├── functions/
 │   └── migrations/
 ├── package.json
 ├── index.html
 └── README.md

🛠️ Setup Instructions
🔧 Backend Setup

Install Supabase CLI

Run migrations:

supabase db reset


Start local development:

supabase start

🎨 Frontend Setup

Install dependencies:

npm install


Start development server:

npm run dev

🖼️ Screenshots

(Add your actual screenshots here)

/screenshots/dashboard.png
/screenshots/login.png
/screenshots/admin.png

🤖 My AI Usage

This project was developed with transparent AI assistance as required.

AI Tools Used

ChatGPT (Code guidance, commit message drafting, debugging help)

GitHub Copilot (Boilerplate suggestions while coding)

How AI Was Used

Planning API endpoint structure

Writing initial failing tests for TDD

Generating commit message templates

Debugging authentication issues

Improving code readability

Writing README structure

Reflection

AI tools improved my speed and clarity during the project.
However, I always reviewed and modified all AI-generated suggestions myself.
AI acted as a helper—not a replacement—for my work.

📚 GitHub Multiple Authors Docs:
https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-a-commit-with-multiple-authors

📄 Test Report

(Add your vitest or backend test report output here)

Example:

 PASS  src/tests/AuthContext.test.ts
 PASS  src/tests/api.test.ts

 Test Files  2 passed (2)
      Tests  10 passed (10)
   Start at  0.38s
   Duration  1.28s