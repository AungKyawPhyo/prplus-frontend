PR+ Event Management System

A full-stack event management platform with FastAPI + GraphQL backend and React (Vite + TypeScript) frontend, featuring secure authentication, role-based authorization, and a modern responsive UI.

⸻

🚀 Features

✅ Authentication & Authorization
	•	JWT-based authentication.
	•	Protected routes with role-based access control.
	•	Logout with complete token clearance.

✅ User Management
	•	Manager: Create, update, delete users.
	•	Staff: View-only for users.
	•	Password change functionality for all users.

✅ Event Management
	•	Manager: Full CRUD on events + Bulk CSV import.
	•	Staff: Create/Update/Bulk Import events, cannot delete.
	•	Filtering by name, contact, venue, date range.
	•	“Display Event to Monitor” feature with fullscreen public display.

✅ Frontend (React + Vite)
	•	Apollo Client for GraphQL.
	•	Modern UI with role-based restrictions.
	•	Data validation and error handling.

✅ Backend (FastAPI + GraphQL)
	•	Async SQLAlchemy + PostgreSQL for scalability.
	•	Modular service-based architecture for maintainability.
	•	GraphQL API for flexible frontend queries.

⸻

🛠️ Tech Stack
	•	Frontend: React, Vite, TypeScript, Apollo Client
	•	Backend: Python3, FastAPI, Ariadne (GraphQL), Async SQLAlchemy, PostgreSQL
	•	Auth: JWT with role-based middleware
	•	Deployment:
	•	Frontend: Netlify
	•	Backend: Render
	•	Database: Render PostgreSQL

⸻

🔗 Live Demo
	•	Frontend: https://aung-prplus.netlify.app
	•	Backend (GraphQL Playground): https://prplus-backend.onrender.com/graphql

⚡ Installation

Backend (FastAPI)
  # Clone repo
git clone https://github.com/your-username/prplus-backend.git
cd prplus-backend

# Create virtual env & install deps
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload

Frontend (React + Vite)
# Clone repo
git clone https://github.com/your-username/prplus-frontend.git
cd prplus-frontend

# Install deps
npm install

# Run dev server
npm run dev


🧪 Default Manager Account
	•	Username: manager
	•	Password: manager123
