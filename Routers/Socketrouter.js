import { socketEvents } from "../Controllers/Socketcontrollers.js";




export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Yeni socket bağlantısı: " + socket.id);
 
    socketEvents(socket, io);
  });
};
