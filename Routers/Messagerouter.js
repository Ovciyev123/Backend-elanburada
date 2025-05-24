import { Router } from "express";
import { Messagecontrollers } from "../Controllers/Messagecontroller.js";





export const messagerouter=new Router()

messagerouter.post("/",Messagecontrollers.Messagepost)

messagerouter.get("/:conversationId",Messagecontrollers.getMessage)

messagerouter.get("/unread-count/:email", Messagecontrollers.unreadCount);