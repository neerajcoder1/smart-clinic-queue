# ClinIQ
<img width="1919" height="873" alt="image" src="https://github.com/user-attachments/assets/27770be1-d58f-48cd-bc22-734f07dd2949" />
**Video** 
https://youtu.be/Z72rn5QpNpg
ClinIQ is a real-time clinic queue management system that helps reception staff manage tokens, notify patients, and track consultations live across screens.

 HEAD
<img width="1651" height="695" alt="image" src="https://github.com/user-attachments/assets/b18823ee-1edc-4757-9c3a-ff4361cdcdf6" />
=======
Live frontend:[ https://smart-clinic-queue-git-main-neerajcoder1s-projects.vercel.app/ 71c34fd (chore: improve README — overview, architecture, setup, sockets, edge cases, wait-time)](https://smart-clinic-queue.vercel.app/)

--

**Project Overview**

- ClinIQ gives receptionists a fast way to add and call patients, shows a patient-facing display, and tracks completed consultations and average wait times in real time using Socket.IO.
- Primary users: receptionists, patients in waiting area, clinicians (for logs/stats).

**Architecture**

- Frontend: React + Vite + Tailwind. Two main pages: Receptionist Dashboard and Patient Display.
- Backend: Node.js + Express + Socket.IO. Provides REST endpoints for CRUD on queue items and emits socket events for real-time updates.
- Database: MongoDB (Mongoose) stores queue items and settings.
- Real-time flow: frontend connects to backend via a Socket.IO namespace; events propagate from receptionist actions → server → all connected clients.

Deployment diagram (high level):

Frontend (Vercel) ←→ Backend (Node/Express) ←→ MongoDB (Atlas or Docker)  
Socket.IO channels broadcast updates to all connected clients.

**Setup (Local)**

1. Clone and install dependencies

```bash
git clone <repo-url>
cd cliniq
npm install
```

2. Backend env variables (create `.env` in `cliniq/backend`)

- `MONGODB_URI` (default fallback: `mongodb://localhost:27017/cliniq`)
- `PORT` (default `5000`)
- `FRONTEND_URL` (optional)

3. Run services

```powershell
# start local Mongo (optional)
docker run -d --name cliniq-mongo -p 27017:27017 mongo:6

# start backend
cd cliniq/backend
npm run dev

# start frontend
cd ../frontend
npm run dev
```

4. Notes

- If `MONGODB_URI` points to a remote DB (Atlas), you can stop local Docker without affecting the app.

**Live demo**

- Frontend: https://smart-clinic-queue-git-main-neerajcoder1s-projects.vercel.app/
- If you have a deployed backend, set `VITE_BACKEND_URL` in the frontend env/host settings.

**Screenshots**

Add screenshots to `docs/screenshots/` and commit them. Example images to include:

- `docs/screenshots/reception-dashboard.png`
- `docs/screenshots/patient-display.png`
- `docs/screenshots/stats-wait-time.png`

Then reference them here with relative links in GitHub (they will render in the README).

**Socket flow (sequence)**

1. Client connects: `socket.emit('join', { room: 'clinic' })` (handled in `socket/socketHandler.js`)
2. Receptionist adds patient → frontend sends `add_patient` REST call; server persists and emits `queue_updated` via Socket.IO.
3. Receptionist calls next → server updates patient status to `called` and emits `patient_called` with token and counter info.
4. Patient display receives `patient_called` and highlights the token.
5. When consultation completes, receptionist triggers `complete` → server records finish time, emits `consultation_completed` and recalculates wait times.

Event names in this project (examples): `queue_updated`, `patient_called`, `consultation_completed`, `connection_status`.

**Wait-time logic**

- Wait time is computed from completed consultations: average service time = mean(completed.finish - completed.start).
- Estimated wait for next patient = average service time × (position in queue).
- Short-term smoothing: recent N completions weighted more heavily (configurable in `Settings`), and minimum/maximum bounds applied to avoid extreme estimates.

**Edge cases & handling**

- Duplicate tokens: server enforces unique token generation and rejects duplicates.
- Client disconnects: server listens for `disconnect` and re-broadcasts `connection_status`; receptionist UI shows offline warnings.
- Mongo downtime: backend uses `MONGODB_URI` fallback and logs connection errors. If the DB is unreachable, REST endpoints return 5xx and Socket events stop—frontends display an error banner.
- Long-running consultations: timeouts are not forced; consider adding admin override for marking consultations complete.

**Developer notes**

- DB connection file: `backend/middleware/db.js` (uses `process.env.MONGODB_URI` or `mongodb://localhost:27017/cliniq`).
- Socket handler: `backend/socket/socketHandler.js` (emits and listens for core events).
- Queue logic: `backend/services/queueService.js` and `backend/controllers/queueController.js`.

**Contributing**

- Please open issues for bugs or feature requests. Fork the repo and send PRs for improvements.

**License & Contact**

- MIT License (or specify your license)
- Author: Your Name — open an issue or PR for questions.
