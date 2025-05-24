import { MessageModel } from "../Models/messagemodel.js"
import UserProfile from "../Models/Profilemodel.js";




export const Messagecontrollers={

    Messagepost: async (req, res) => {
  try {
    const { senderId, receiverId, conversationId, content } = req.body;

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      conversationId,
      content,
      read: false,
    });

    await newMessage.save();

    res.send({ message: "successfully", data: newMessage });
  } catch (error) {
    res.send({ message: "error", error });
  }
},
    getMessage:async (req,res)=>{

        try{
        const {conversationId}=req.params

        let Messages=await MessageModel.find({conversationId})

        res.send({message:"succesfully",Messages})
        }
        catch(error){

            res.send({message:"error",error})
        }
    },
    unreadCount: async (req, res) => {
  try {
    const { email } = req.params;

    const receiver = await UserProfile.findOne({ email }); // ✅ Email ilə istifadəçi tap
    if (!receiver) return res.status(404).json({ message: "User not found" });

    const count = await MessageModel.countDocuments({
      receiverId: receiver._id.toString(),
      read: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
}

}