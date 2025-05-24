import { MessageModel } from "../Models/messagemodel.js"




export const Messagecontrollers={

    Messagepost:async (req,res)=>{
        try{ 
       const {senderId,conversationId,content}=req.body

       let newMessage=new MessageModel({senderId,conversationId,content})

       await newMessage.save()

       res.send({message:"successfully",data:newMessage})
    
    }catch(error){

        res.send({message:"error",error})
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
    }
    ,unreadCount:async (req, res) => {
  try {
    const userId = req.params.userId;

    const count = await MessageModel.countDocuments({
      read: false,
      receiverId: userId, // bunu əlavə etməlisən modelə
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
}
,

unreadPerSender: async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await MessageModel.aggregate([
      { $match: { receiverId: userId, read: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
      { $project: { senderId: "$_id", count: 1, _id: 0 } }
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
},
markAsRead: async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    await MessageModel.updateMany(
      { conversationId, receiverId: userId, read: false },
      { $set: { read: true } }
    );

    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
}

}


