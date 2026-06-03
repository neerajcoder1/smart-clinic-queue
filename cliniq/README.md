# ClinIQ — Real-Time Clinic Queue Management System

> Replace paper tokens and shouting with a real-time digital queue that updates instantly across all screens.

**Live frontend:** https://smart-clinic-queue-git-main-neerajcoder1s-projects.vercel.app/

---

## Problem Statement

Small clinics in India and across the world still manage patient queues with:

- Paper tokens handed at reception
- Staff manually calling out names or numbers
- Patients with zero visibility into how long they'll wait
- No data for improving clinic efficiency

**ClinIQ eliminates all of this.**

---

## Solution Architecture

```
┌─────────────────┐     HTTP + Socket.IO     ┌──────────────────────┐
│  Receptionist   │◄────────────────────────►│   Node.js / Express  │
│   Dashboard     │                          │   + Socket.IO Server  │
└─────────────────┘                          └──────────┬───────────┘
                                                        │
┌─────────────────┐     Socket.IO broadcast  │          │ MongoDB
│  Patient Wait   │◄────────────────────────┘   ┌──────▼──────────┐
│    Screen       │                              │  Queue Collection│
└─────────────────┘                              └─────────────────┘
```

---

## Tech Stack

| Layer    | Technology         |
| -------- | ------------------ |
| Frontend | React 18 + Vite    |
| Styling  | Tailwind CSS       |
| Realtime | Socket.IO (client) |
| Backend  | Node.js + Express  |
| Database | MongoDB + Mongoose |
| Realtime | Socket.IO (server) |

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/cliniq.git
cd cliniq

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend:**

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
```

**Frontend:**

```bash
cd frontend
cp .env.example .env
# Leave VITE_BACKEND_URL empty for local dev (uses Vite proxy)
```

### 3. Run Development

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open:

- Receptionist: http://localhost:5173/receptionist
- Patient Display: http://localhost:5173/display

---

## Deployment Instructions

### Backend — Render / Railway

1. Push `backend/` to GitHub
2. Create a Web Service on [Render](https://render.com) or [Railway](https://railway.app)
3. Set environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   FRONTEND_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```
4. Start command: `node server.js`

### Frontend — Vercel

1. Push `frontend/` to GitHub
2. Import on [Vercel](https://vercel.com)
3. Set environment variable:
   ```
   VITE_BACKEND_URL=https://your-backend.onrender.com
   ```
4. Deploy

---

## API Overview

| Method | Endpoint                    | Description                   |
| ------ | --------------------------- | ----------------------------- |
| GET    | `/api/queue`                | Get full today's queue state  |
| POST   | `/api/queue/add`            | Add patient `{ patientName }` |
| POST   | `/api/queue/call-next`      | Call next waiting patient     |
| POST   | `/api/queue/complete`       | Complete current consultation |
| GET    | `/api/settings`             | Get clinic settings           |
| PATCH  | `/api/settings/avg-minutes` | Update default avg minutes    |
| GET    | `/health`                   | Health check                  |

---

## Socket Events

| Event                    | Direction       | Payload              |
| ------------------------ | --------------- | -------------------- |
| `queue_updated`          | Server → All    | Full queue payload   |
| `patient_added`          | Server → All    | `{ patient, queue }` |
| `token_called`           | Server → All    | `{ patient, queue }` |
| `consultation_started`   | Server → All    | `{ patient }`        |
| `consultation_completed` | Server → All    | `{ patient, queue }` |
| `ping_check`             | Client → Server | —                    |
| `pong_check`             | Server → Client | `{ ts }`             |

---

## Wait-Time Calculation Logic

ClinIQ uses **dynamic, data-driven wait time** — not hardcoded estimates.

```
Average Consultation Time =
  Sum of all completed consultation durations (today)
  ÷
  Number of completed consultations

Estimated Wait for Patient N =
  (Queue position - 1 + (1 if in-progress)) × Average Consultation Time
```

**Fallback:** If no consultations are completed yet, defaults to 7 minutes per patient.

This means:

- At 9am: uses default (7 min)
- By 10am with 5 completed: uses real average
- More accurate all day as data accumulates

---

## Edge Case Handling

| Edge Case                  | Handling                                      |
| -------------------------- | --------------------------------------------- |
| Duplicate token generation | Retry loop with exponential backoff (5x)      |
| Double "Call Next" click   | Backend rejects if in-progress exists         |
| Double "Complete" click    | Backend rejects if no in-progress             |
| Browser refresh            | Socket reconnects, server sends full state    |
| Empty queue                | UI shows empty state, buttons disabled        |
| No active consultation     | "Complete" button hidden/disabled             |
| Socket disconnect          | Auto-reconnect with exponential backoff       |
| Simultaneous adds          | MongoDB unique index + retry loop             |
| Server restart             | Queue persisted in MongoDB, synced on connect |

---

## Screenshots

> _Screenshots to be added post-deployment_

- `/screenshots/receptionist-dashboard.png`
- `/screenshots/patient-display.png`
- `/screenshots/live-queue-update.gif`

---

## Demo Statement

> "Our system becomes more accurate throughout the day because wait times are calculated from actual consultation durations instead of fixed assumptions."

---

## License

MIT
