import express from "express";
import {
  CreateAd,
  getAdByEmail,
  getAdById,
  getAllAds,
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getPendingAds,
  updateAdStatus
} from "../Controllers/Addcontrollers.js";
import upload from "../Middlewares/FileUpload.js";
import Listing from "../Models/Addmodel.js";

const addRouter = express.Router();

// Elan yaratma
addRouter.get("/ads/pending", getPendingAds);
addRouter.patch("/ads/:id", updateAdStatus);

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
    console.log("Received filters:", filters);

    const query = {};

    // city, category, dealType, region, settlement
    if (filters.city) query.city = filters.city;

    // Category: backend modelində 'Yeni tikili', 'Köhnə tikili' və s. olduğu üçün burada uyğunlaşdırma lazım ola bilər
    // Məsələn, frontend-dən 'Mənzil' gəlirsə, onu 'Yeni tikili' və 'Köhnə tikili' kimi qəbul etmək:
    if (filters.category) {
      if (filters.category === 'Mənzil') {
        query.category = { $in: ['Yeni tikili', 'Köhnə tikili'] };
      } else {
        query.category = filters.category;
      }
    }

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

    // Boolean filterlər (string olaraq 'true' gəldiyinə görə yoxlanılır)
    if (filters.hasExtract === 'true') query.hasExtract = true;
    if (filters.hasMortgage === 'true') query.hasMortgage = true;
 // Boolean filterlər
if (filters.rentTypeMonthly === 'true' && filters.rentTypeDaily === 'true') {
  query.$or = [
    { rentTypeMonthly: true },
    { rentTypeDaily: true }
  ];
} else {
  if (filters.rentTypeMonthly === 'true') query.rentTypeMonthly = true;
  if (filters.rentTypeDaily === 'true') query.rentTypeDaily = true;
}


    // Mərtəbə filterləri (adları frontend-lə uyğunlaşdırılıb)
    if (filters.onlyTopFloor === 'true') {
      // floor = totalFloors
      query.$expr = { $eq: ['$floor', '$totalFloors'] };
    } else {
      // "Ən üst mərtəbə olmamalı"
      if (filters.excludeTopFloor === 'true') {
        query.$expr = { $ne: ['$floor', '$totalFloors'] };
      }

      // "1-ci mərtəbə olmamalı"
      if (filters.exclude1stFloor === 'true') {
        if (!query.floor) query.floor = {};
        query.floor.$ne = 1;
      }
    }



    if (filters.floorMin || filters.floorMax) {
      query.floor = query.floor || {}; // Əgər əvvəldən floor varsa onu obyektə çevir
      if (filters.floorMin) query.floor.$gte = Number(filters.floorMin);
      if (filters.floorMax) query.floor.$lte = Number(filters.floorMax);
    }

    console.log("Mongo query:", query);

    const listings = await Listing.find(query).sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error("Elanların gətirilməsi zamanı xəta:", error);
    res.status(500).json({ message: "Server xətası" });
  }
});

export default addRouter;



