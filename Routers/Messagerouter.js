import { Router } from "express";
import { Messagecontrollers } from "../Controllers/Messagecontroller.js";





export const messagerouter=new Router()

messagerouter.post("/",Messagecontrollers.Messagepost)

messagerouter.get("/:conversationId",Messagecontrollers.getMessage)

messagerouter.get("/unread-count/:userId", Messagecontrollers.unreadCount);
messagerouter.get("/unread-per-sender/:userId", Messagecontrollers.unreadPerSender);
messagerouter.patch("/mark-as-read", Messagecontrollers.markAsRead);