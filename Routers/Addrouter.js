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
import upload from "../Middlewares/FileUpload.js";

const addRouter = express.Router();

// Elan yaratma
addRouter.post("/", upload.array("images", 15), CreateAd);

// Bütün elanları gətir
addRouter.get("/", getAllAds);

// ID ilə elan gətir
addRouter.get("/by-id/:id", getAdById);

// Email ilə elanları gətir
addRouter.get("/by-email/:email", getAdByEmail);

// Elana favori əlavə et
addRouter.post("/:id/favorite", addFavorite);

// Elandan favori sil
addRouter.delete("/:id/favorite", removeFavorite);

// İstifadəçinin favorilərini gətir
addRouter.get("/user/:email/favorites", getUserFavorites);

export default addRouter;
