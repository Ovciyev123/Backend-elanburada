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

  
  socket.on("sendMessage", ({ senderId, receiverId, content }) => {
    console.log(`sendMessage event -> senderId: ${senderId}, receiverId: ${receiverId}, content: ${content}`);

    const user = getUser(senderId);
    if (user) {
      console.log(`Mesaj iletiliyor -> receiver socketId: ${user.socketId}`);
      io.to(user.socketId).emit("getMessage", { senderId, content });
    } else {
      console.error("Kullanıcı bulunamadı:", senderId);
    }
  });


  socket.on("disconnect", () => {
    console.log(`User disconnected -> socketId: ${socket.id}`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
};
