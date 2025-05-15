import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  region: { type: String },
  settlement: { type: String },
  mapAddress: { type: String },
  address: { type: String },
  images: [{ type: String }],
  name: { type: String, required: true },
  isAgent: { type: Boolean, default: true },
  email: { type: String },
  phone: { type: String },
  dealType: {
    type: String,
    enum: ['Alış', 'Kirayə'],
    required: true
  },
  category: {
    type: String,
    enum: ['Yeni tikili', 'Köhnə tikili', 'Həyət evi', 'Ofis', 'Qaraj', 'Obyekt', 'Torpaq'],
    required: true
  },
  city: { type: String, required: true },
  rooms: { type: Number },
  area: { type: Number, required: true },
  floor: { type: Number },
  totalFloors: { type: Number },
  additionalInfo: { type: String },
  price: { type: Number, required: true },
  repairStatus: { type: String, enum: ['temirli', 'temirsiz', ''] },
  hasExtract: { type: Boolean, default: false },
  hasMortgage: { type: Boolean, default: false },
  rentTypeMonthly: { type: Boolean, default: false },
  rentTypeDaily: { type: Boolean, default: false },
 favorites: {
  type: [
    {
      region: String,
      settlement: String,
      mapAddress: String,
      address: String,
      images: [String],
      name: String,
      isAgent: { type: Boolean, default: true },
      email: String,
      phone: String,
      dealType: {
        type: String,
        enum: ['Alış', 'Kirayə']
      },
      category: {
        type: String,
        enum: ['Yeni tikili', 'Köhnə tikili', 'Həyət evi', 'Ofis', 'Qaraj', 'Obyekt', 'Torpaq']
      },
      city: String,
      rooms: Number,
      area: Number,
      floor: Number,
      totalFloors: Number,
      additionalInfo: String,
      price: Number,
      repairStatus: {
        type: String,
        enum: ['təmirli', 'təmirsiz', '']
      },
      hasExtract: { type: Boolean, default: false },
      hasMortgage: {
         type: Boolean, default: false },
      rentTypeMonthly: { type: Boolean, default: false },
      rentTypeDaily: { type: Boolean, default: false },
      favoritedAt: { type: Date, default: Date.now }
    }
  ],
  default: []
}
,
  createdAt: { type: Date, default: Date.now }
});

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
export default Listing;
