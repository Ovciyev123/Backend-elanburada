import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads")); 

const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-elanburada0802.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
   
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const port = process.env.PORT || 4000;


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['https://frontend-elanburada0802.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

import "./Config/Config.js";

// Router-lər
import { authrouter } from "./Routers/authrouter.js";
import addRouter from "./Routers/Addrouter.js";
import { messagerouter } from "./Routers/Messagerouter.js";
import { conversationrouter } from "./Routers/Conversationrouter.js";
import { initializeSocket } from "./Routers/Socketrouter.js";
import profilerouter from "./Routers/profilerouter.js";
import { adminrouter } from "./Routers/AdminAuthRouter.js";


// API endpoint-lər
app.use("/tacstyle/auth", authrouter);
app.use("/api/ads", addRouter);
app.use("/api/admin",adminrouter);
app.use("/api/conversations", conversationrouter);
app.use("/api/messages", messagerouter);
app.use("/api/profile", profilerouter);

// Socket.io başlat
initializeSocket(io);

// Serveri dinlə
server.listen(port, () => {
  console.log(`${port} portunda dinleniyor`);
});
