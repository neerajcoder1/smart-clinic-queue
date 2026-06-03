require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./middleware/db");
const queueRoutes = require("./routes/queue");
const settingsRoutes = require("./routes/settings");
const { initSocket } = require("./socket/socketHandler");

const app = express();
const server = http.createServer(app);

const envFrontend = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");
const allowedOrigins = new Set([
  envFrontend,
  "https://smart-clinic-queue.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const normalized = origin.replace(/\/+$/, "");
  if (allowedOrigins.has(normalized)) return true;
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalized);
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

const io = new Server(server, {
  cors: corsOptions,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Attach io to req so controllers can emit
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/queue", queueRoutes);
app.use("/api/settings", settingsRoutes);

// Health check
app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);

// 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Error]", err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

// Initialize Socket.IO handlers
initSocket(io);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🏥 ClinIQ backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
