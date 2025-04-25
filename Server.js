import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Uygulama ve middleware'ler
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); 

// Veritabanı bağlantısı
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

// HTTP ve Socket server oluştur
const server = http.createServer(app);

// Socket.IO server başlat
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000, // bağlantı yoxlanması
  pingInterval: 25000,
});


// Socket işlemleri
initializeSocket(io);

// Alternatif olarak eğer `initializeSocket` yoksa şöyle basit yazabilirsin:
io.on("connection", (socket) => {
  console.log("Yeni kullanıcı bağlandı:", socket.id);

  socket.on("addUser", (userId) => {
    console.log(`Kullanıcı eklendi: ${userId}`);
    socket.userId = userId;
  });

  socket.on("sendMessage", ({ senderId, receiverId, content }) => {
    console.log(`Mesaj alındı: ${content} → ${receiverId}`);
    socket.broadcast.emit("getMessage", {
      senderId,
      content,
    });
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı:", socket.id);
  });
});

// Sunucuyu başlat (BURASI ÖNEMLİ!)
server.listen(3000, () => {
  console.log("✅ Sunucu 3000 portunda çalışıyor");
});
