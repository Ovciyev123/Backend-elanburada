import { Router } from 'express';
import { Authcontrollers } from '../Controllers/authcontroller.js';
import { upload } from '../Middlewares/FileUpload.js';


export const authrouter = new Router();

authrouter.post("/register", upload.single("profileImage"),Authcontrollers.register);
authrouter.post('/login', Authcontrollers.login);
authrouter.post('/confirm',Authcontrollers.confirm);
authrouter.get("/",Authcontrollers.searchUsers)
authrouter.get("/all",Authcontrollers.getAllUsers)


