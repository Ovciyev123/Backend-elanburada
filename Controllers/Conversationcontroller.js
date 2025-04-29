import { ConservationModel } from "../Models/Conversationmodel.js";


export const Conversationcontrollers = {
  
  // Yeni konuşma oluşturma
  MembersPost: async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;

      // Eğer iki kişi arasında zaten bir konuşma varsa tekrar eklememek için kontrol edelim.
      const existingConversation = await ConservationModel.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (existingConversation) {
        return res.send({ message: "Conversation already exists", data: existingConversation });
      }

      // Yeni konuşma oluştur
      const conversation = new ConservationModel({
        members: [senderId, receiverId], // members array olarak kaydediliyor
      });

      await conversation.save();
      res.send({ message: "Successfully created", data: conversation });
    } catch (error) {
      res.status(500).send({ message: "Error", error });
    }
  },

  // Kullanıcının dahil olduğu konuşmaları getir
  GetMembers: async (req, res) => {
    try {
      const { userId } = req.params;

      console.log(userId);
      

      const conversations = await ConservationModel.find({
        members: userId, // `members` dizisinin içinde userId olup olmadığını kontrol ediyoruz
      });

      res.send(conversations);
    } catch (error) {
      res.status(500).send({ message: "Error", error });
    }
  },

  // Belirli iki kullanıcı arasındaki konuşmayı getir
  GetTwoUsers: async (req, res) => {
    try {
      const { firstUserId, secondUserId } = req.params;

      const conversation = await ConservationModel.findOne({
        members: { $all: [firstUserId, secondUserId] }, // İki kullanıcının da içinde olduğu sohbeti bul
      });

      if (!conversation) {
        return res.status(404).send({ message: "No conversation found" });
      }

      res.send(conversation);
    } catch (error) {
      res.status(500).send({ message: "Error", error });
    }
  },
};

