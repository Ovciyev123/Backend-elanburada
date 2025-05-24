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
    read: { type: Boolean, default: false },
    receiverId: { type: String, required: true },

  },
  { timestamps: true } // Timestamps əlavə olunur
);

export const MessageModel = model("Message", MessageSchema);
