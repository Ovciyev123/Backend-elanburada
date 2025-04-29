import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Uygulama ve middleware'ler
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); 

app.use(cors({
  origin: 'https://frontend-elanburada.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

const port = process.env.PORT || 4000;
import "./Config/Config.js";

// Router'lar
import { authrouter } from "./Routers/authrouter.js";
import addRouter from "./Routers/Addrouter.js";
import { messagerouter } from "./Routers/Messagerouter.js";
import { conversationrouter } from "./Routers/Conversationrouter.js";
import { initializeSocket } from "./Routers/Socketrouter.js";
import profilerouter from "./Routers/profilerouter.js";

// API Endpoint'leri
app.use("/tacstyle/auth", authrouter);
app.use("/api/ads", addRouter);
app.use("/api/conversations", conversationrouter);
app.use("/api/messages", messagerouter);
app.use("/api/profile", profilerouter);

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
  },
});




initializeSocket(io);

server.listen(port,()=>{

    console.log("3000 portda dinlenilir");
    
})