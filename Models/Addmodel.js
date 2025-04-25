import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  city: String,
  category: String,
  price: String,
  images: [String],
  about: String,
  favoritedAt: { type: Date, default: Date.now }
});

const addSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true }, 
  email: { type: String, required: true }, 
  phoneNumber: { type: String, required: true },
  category: { type: String, required: true }, 
  about: { type: String, required: true },
  city: { type: String, required: true }, 
  date: { type: Date, default: Date.now },
  images: [{ type: String }],
  favorites: [favoriteSchema] // Favoritlərdə bütün məlumatlar saxlanacaq
});

const Add = mongoose.model("Add", addSchema);
export default Add;
