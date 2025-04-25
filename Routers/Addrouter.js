import express from "express";
import { 
  CreateAd, 
  getAdByEmail, 
  getAdById, 
  getAllAds, 
  addFavorite, 
  removeFavorite, 
  getUserFavorites 
} from "../Controllers/Addcontrollers.js";
import { upload } from "../Middlewares/FileUpload.js"; 

const addRouter = express.Router();

addRouter.post("/", upload.array("images", 15), CreateAd);
addRouter.get("/", getAllAds);

addRouter.get("/by-id/:id", getAdById);
addRouter.get("/by-email/:email", getAdByEmail);

addRouter.post("/:id/favorite", addFavorite);
addRouter.delete("/:id/favorite", removeFavorite);
addRouter.get("/user/:email/favorites", getUserFavorites); 


export default addRouter;
