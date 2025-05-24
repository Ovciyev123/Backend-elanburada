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
     receiverId:{ String}, 
    read: { type: Boolean, default: false }, 
  },
  { timestamps: true } // Timestamps əlavə olunur
);

export const MessageModel = model("Message", MessageSchema);
