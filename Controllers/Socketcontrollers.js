import { MessageModel } from "../Models/messagemodel.js";



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
  
    const receiver = getUser(receiverId);
  
    // ✅ Mesajı DB-yə qeyd et
    const newMessage = new MessageModel({
      senderId,
      receiverId,
      content,
      conversationId,
    });
  
    await newMessage.save(); // Bu createdAt avtomatik əlavə edəcək
  
    const payload = {
      _id: newMessage._id,
      senderId,
      content,
      conversationId,
      createdAt: newMessage.createdAt, // createdAt burada əlavə edilir
    };
  
    // ✅ Qarşı tərəfə mesaj
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", payload);
    }
  
    // ✅ Özünə də mesaj göstərmək istəsən
    const sender = getUser(senderId);
    if (sender) {
      io.to(sender.socketId).emit("getMessage", payload);
    }
  });
  
  

  socket.on("disconnect", () => {
    console.log(`User disconnected -> socketId: ${socket.id}`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
};