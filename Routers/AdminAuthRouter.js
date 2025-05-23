import { Router } from 'express';
import { AdminControllers } from '../Controllers/AdminControllers.js';

export const adminrouter = Router();

adminrouter.post("/login", AdminControllers.login);
adminrouter.get("/all", AdminControllers.getAllAdmins);