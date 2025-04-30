import express from 'express';

import { 
    createUserProfile, 
    deleteUserProfile, 
    getAllUserProfiles, 
    updateUserProfile,
    getUserProfileByEmail, // Yeni controller funksiyası
    getUserProfileById,
    ChatProfiles
} from '../Controllers/profilecontroller.js';
import upload from '../Middlewares/FileUpload.js';

const profilerouter = express.Router();

// Məlumatları email ilə əldə etmək üçün yeni route
profilerouter.get('/by-email/:email', getUserProfileByEmail); 

profilerouter.post('/', upload.single('profileImage'), createUserProfile);
profilerouter.get('/', getAllUserProfiles);
profilerouter.get('/user/:id', getUserProfileById);
profilerouter.put('/:id', updateUserProfile);
profilerouter.delete('/:id', deleteUserProfile);
profilerouter.post("/chatprofile",ChatProfiles)

export default profilerouter;
