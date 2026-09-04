# ArogyaSakhi AI

AI-powered intelligent rural healthcare and emergency assistance platform.

## Project Overview

This repository contains the frontend (React + Vite) and backend (FastAPI) for the ArogyaSakhi AI demo application. The project provides patient management, AI symptom checks, SOS/emergency alerts, and dashboards for multiple roles.

## Features
- Patient management (PCW / ASHA / Doctor / Admin)
- AI symptom checker and image/voice analysis
- SOS emergency alerting and doctor assignment
- Dashboards & analytics

## Tech Stack
- Backend: Python, FastAPI, SQLAlchemy
- Frontend: React, Vite, Axios
- DB: MySQL (preferred) with automatic SQLite fallback for development

## Repository Layout

```
project-root/
├── frontend-modern/
├── backend-fastapi/
├── docs/
├── README.md
├── .gitignore
└── .env.example
```

## Quickstart

Prerequisites:
- Node 18+ and npm
- Python 3.10+ (venv recommended)
- MySQL server (optional). If unavailable, the app falls back to SQLite (`dev.db`).

Backend (development):

```powershell
cd backend-fastapi
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Frontend (development):

```bash
cd frontend-modern
npm install
npm run dev
# Opens on http://localhost:5173 (or a nearby free port)
```

Production build (frontend):

```bash
cd frontend-modern
npm run build
npm run preview
```

## Environment
Use `.env` at project root or `backend-fastapi/.env` to override defaults. Example values provided in `.env.example`.

## Demo Credentials
- Username: `admin`
- Password: `admin123`

## Screenshots
Add screenshots under `docs/` and link them here.

## Contribution & Deployment
Keep changes minimal: do not commit secrets. Use `.env.example` for public examples.
# ArogyaSakhi AI

AI-powered intelligent rural healthcare and emergency assistance platform.

## Prerequisites

- Node.js 18+
- Python 3.12
- MySQL 8+ running locally

## Database

```
HOST=localhost
PORT=3306
DATABASE=arogya_sakhi_ai
USER=root
PASSWORD=root
```

## Backend (FastAPI)

```powershell
cd "healthcare-dss - WITH V\backend-fastapi"
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn app.main:app --port 8001 --host 127.0.0.1
```

API docs: http://127.0.0.1:8001/docs

## Frontend (React + Vite)

```powershell
cd "healthcare-dss - WITH V\frontend-modern"
npm install
npm run dev
```

App: http://localhost:5173

## Demo credentials

| Role | Username | Password |
|------|----------|----------|
| ASHA Worker | pcw1 | pcw123 |
| Doctor | doctor1 | doc123 |
| Patient | patient1 | pat123 |
| Admin | admin | admin123 |
## Project Purpose

ArogyaSakhi AI is designed to support rural healthcare by connecting patients, community health workers, doctors, and administrators through a unified digital platform. It combines AI-assisted health assessment with emergency assistance and role-based healthcare management.

## Future Enhancements

- Integration with additional healthcare and emergency services
- Improved multilingual and voice-based assistance
- Advanced analytics for healthcare workers and administrators
- Secure cloud deployment and scalable infrastructure