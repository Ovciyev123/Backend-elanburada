import { MessageModel } from "../Models/messagemodel.js";

import Profile from "../Models/Profile.js";
import { sendNotificationToEmail } from "../Utils/fcm.js";

let users = [];

export const socketEvents = (socket, io) => {
  console.log("Yeni socket bağlantısı: " + socket.id);

  const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId)) {
      users.push({ userId, socketId });
      console.log(`Kullanıcı eklendi -> userId: ${userId}, socketId: ${socketId}`);
      console.log("Güncel kullanıcı listesi:", users);
    }
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
    console.log(`Kullanıcı çıkış yaptı -> socketId: ${socketId}`);
    console.log("Güncellenmiş kullanıcı listesi:", users);
  };

  const getUser = (userId) => {
    const user = users.find((user) => user.userId === userId);
    console.log(`getUser çağrıldı -> userId: ${userId}, Bulunan kullanıcı:`, user);
    return user;
  };

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, content, conversationId }) => {
    console.log(`sendMessage event -> senderId: ${senderId}, receiverId: ${receiverId}, content: ${content}`);

    try {
      // 1. Mesajı veritabanına kaydet
      const newMessage = new MessageModel({
        senderId,
        receiverId,
        content,
        conversationId,
        isRead: false,
      });

      const savedMessage = await newMessage.save();

      // 2. Alıcı online ise mesajı socket ile gönder
      const receiver = getUser(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", {
          senderId,
          content,
          createdAt: savedMessage.createdAt,
        });
      } else {
        console.log("Qəbul edən online deyil, mesaj DB-də saxlandı.");
      }

      // 3. Alıcının email'ini al ve FCM bildirimi gönder
      const receiverProfile = await Profile.findById(receiverId);
      if (receiverProfile?.email) {
        await sendNotificationToEmail(receiverProfile.email, "Yeni Mesaj", content);
      }
    } catch (error) {
      console.error("Mesaj gönderilirken hata:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected -> socketId: ${socket.id}`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
};
