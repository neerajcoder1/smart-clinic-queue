# ClinIQ

ClinIQ is a real-time clinic queue management system that helps reception staff manage tokens, notify patients, and track consultations live across screens.

**Live frontend:** https://smart-clinic-queue-git-main-neerajcoder1s-projects.vercel.app/

## Features

- Real-time queue updates with Socket.IO
- Receptionist dashboard for adding, calling, and completing patients
- Patient display screen with live status changes
- Dynamic wait-time calculation based on completed consultations
- MongoDB-backed persistence for queue state and settings

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB, Mongoose

## Local Setup

1. Install dependencies for both apps.

```bash
cd cliniq
npm install
```

2. Configure environment variables.

- Backend: `MONGODB_URI`, `FRONTEND_URL`, `PORT`
- Frontend: `VITE_BACKEND_URL` (or `VITE_API_URL`) if you are connecting to a deployed backend

3. Start the development servers.

```bash
# Backend
cd cliniq/backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

## Deployment

### Backend

- Use MongoDB Atlas for `MONGODB_URI`
- Set `FRONTEND_URL` to your deployed frontend URL
- Set `PORT=5000`

### Frontend

- Deploy the frontend on Vercel or a similar static host
- Set `VITE_BACKEND_URL` (or `VITE_API_URL`) to your backend URL if needed

## Project Structure

```text
cliniq/
├── backend/
└── frontend/
```

## Notes

- For local development, MongoDB can run in Docker or on your machine.
- For production, use MongoDB Atlas rather than a local database.
