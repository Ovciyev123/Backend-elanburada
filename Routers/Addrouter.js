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
import Listing from "../Models/Addmodel.js";

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

addRouter.get('/filters', async (req, res) => {
  try {
    const filters = req.query;
    const query = {};

    // Dinamik filtr qurulması
    if (filters.city) query.city = filters.city;
    if (filters.category) query.category = filters.category;
    if (filters.dealType) query.dealType = filters.dealType;
    if (filters.region) query.region = filters.region;
    if (filters.settlement) query.settlement = filters.settlement;

    // Qiymət aralığı
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }

    // Sahə aralığı (kv.m.)
    if (filters.minArea || filters.maxArea) {
      query.area = {};
      if (filters.minArea) query.area.$gte = Number(filters.minArea);
      if (filters.maxArea) query.area.$lte = Number(filters.maxArea);
    }

    // Otaq sayı
    if (filters.rooms) query.rooms = Number(filters.rooms);

    // Təmir vəziyyəti
    if (filters.repairStatus) query.repairStatus = filters.repairStatus;

    // Güzəştli seçimlər
    if (filters.hasExtract === 'true') query.hasExtract = true;
    if (filters.hasMortgage === 'true') query.hasMortgage = true;
    if (filters.rentTypeMonthly === 'true') query.rentTypeMonthly = true;
    if (filters.rentTypeDaily === 'true') query.rentTypeDaily = true;

    const listings = await Listing.find(query).sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error("Elanların gətirilməsi zamanı xəta:", error);
    res.status(500).json({ message: "Server xətası" });
  }
});

export default addRouter;
