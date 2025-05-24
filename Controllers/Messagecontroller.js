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
}