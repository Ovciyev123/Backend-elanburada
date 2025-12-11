import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();

// JSON parsing CORS-dan əvvəl olmalıdır
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-elanburada0802.vercel.app",
  "https://evburada.site",
];

// CORS - YALNIZ BİR DƏFƏ
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, mobile, server requests

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Render üçün preflight
app.options("*", cors());

const port = process.env.PORT || 4000;

// HTTP server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

import "./Config/Config.js";

// Routers
import { authrouter } from "./Routers/authrouter.js";
import addRouter from "./Routers/Addrouter.js";
import { messagerouter } from "./Routers/Messagerouter.js";
import { conversationrouter } from "./Routers/Conversationrouter.js";
import { initializeSocket } from "./Routers/Socketrouter.js";
import profilerouter from "./Routers/profilerouter.js";
import { adminrouter } from "./Routers/AdminAuthRouter.js";


// API Routes
app.use("/tacstyle/auth", authrouter);
app.use("/api/ads", addRouter);
app.use("/api/admin", adminrouter);
app.use("/api/conversations", conversationrouter);
app.use("/api/messages", messagerouter);
app.use("/api/profile", profilerouter);

console.log("🔑 BREVO_API_KEY:", process.env.BREVO_API_KEY);
console.log("🔑 LENGTH:", (process.env.BREVO_API_KEY || "").length);
console.log("BREVO KEY EXISTS:", !!process.env.BREVO_API_KEY);


// Socket.io Init
initializeSocket(io);


// Server start
server.listen(port, () => {
  console.log(`${port} portunda dinleniyor`);
});
