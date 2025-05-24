import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: false,
    },
    senderId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    receiverId: {  // ✅ DÜZELTİLDİ
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);


export const MessageModel = model("Message", MessageSchema);
