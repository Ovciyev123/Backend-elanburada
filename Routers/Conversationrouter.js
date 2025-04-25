import { Router } from "express";
import { Conversationcontrollers } from "../Controllers/Conversationcontroller.js";



export const conversationrouter=new Router()


conversationrouter.post("/",Conversationcontrollers.MembersPost)

conversationrouter.get("/:userId",Conversationcontrollers.GetMembers)

conversationrouter.get("/find/:firstUserId/:secondUserId",Conversationcontrollers.GetTwoUsers)