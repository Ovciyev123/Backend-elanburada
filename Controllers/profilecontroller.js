import UserProfile from "../Models/Profilemodel.js";


export const createUserProfile = async (req, res) => {
  try {
    const {
        userId,
      email,
      profileName,
      bio,
      socialLinks,
      phoneNumber,
      location
    } = req.body;

    const profileImage = req.file
      ? req.files.map((file) => file.path)
      : "";

    const userProfile = new UserProfile({
      userId,
      email,
      profileName,
      bio,
      profileImage,
      phoneNumber,
      location: location ? JSON.parse(location) : undefined,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : [],
    });

    await userProfile.save();
    res.status(201).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfileById = async (req, res) => {
  try {
    // userId yerine _id'ye göre arama yapıyoruz
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profil tapılmadı' });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 
 
export const getUserProfileByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const profile = await UserProfile.findOne({
      email: new RegExp('^' + email + '$', 'i'),
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profil tapılmadı' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server xətası' });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const updated = await UserProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Profil tapılmadı' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const deleted = await UserProfile.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Profil tapılmadı' });
    res.status(200).json({ message: 'Profil silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }}
  export const ChatProfiles = async (req, res) => {
    try {
      const { userIds } = req.body; 
      if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ error: 'userIds alanı gereklidir ve dizi olmalıdır.' });
      }
      
      const profiles = await UserProfile.find({ _id: { $in: userIds } })
      res.json(profiles);
    } catch (error) {
      console.error('Profil sorgulamada hata:', error);
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  }








