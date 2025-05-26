import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['instagram', 'tiktok', 'facebook', 'twitter', 'youtube', 'linkedin', 'website', 'other'],
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { _id: false }); // əlavə ID yaratmasın deyə

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  isBlocked: {
  type: Boolean,
  default: false
},
blockUntil: {
  type: Date,
  default: null
},

  email: {
    type: String,
    required: true,
    unique: true
  },
  profileName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String
  },
  socialLinks: {
    type: [socialLinkSchema],
    default: []
  },
  phoneNumber: {
    type: String
  },
  location: {
    city: { type: String },
    country: { type: String }},

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export default UserProfile;
