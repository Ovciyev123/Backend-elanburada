import UserProfile from "../Models/Profilemodel.js";


const checkBlockExpiry = async (user) => {
  if (user.isBlocked && user.blockUntil && new Date(user.blockUntil) < new Date()) {
    user.isBlocked = false;
    user.blockUntil = null;
    await user.save();
  }
  return user;
};


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

    const profileImage = req.file?.path || "";

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
    let profiles = await UserProfile.find();

   
    const checkedProfiles = await Promise.all(profiles.map(checkBlockExpiry));

    res.status(200).json(checkedProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserProfileById = async (req, res) => {
  try {
    let profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profil tapılmadı' });

    profile = await checkBlockExpiry(profile);

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 
 
export const getUserProfileByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    let profile = await UserProfile.findOne({
      email: new RegExp('^' + email + '$', 'i'),
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profil tapılmadı' });
    }

    profile = await checkBlockExpiry(profile);

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

export const blockUser = async (req, res) => {
  const { email, blockType, until } = req.body;

  if (!email || !blockType) {
    return res.status(400).json({ message: "Email və block növü tələb olunur." });
  }

  try {
    const user = await UserProfile.findOne({ email: new RegExp('^' + email + '$', 'i') });

    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı." });
    }

    if (blockType === 'permanent') {
      user.isBlocked = true;
      user.blockUntil = null;
    } else if (blockType === 'timed') {
      if (!until) {
        return res.status(400).json({ message: "Vaxt daxil edilməyib." });
      }

      const untilDate = new Date(until);
      console.log("Gələn tarix:", until, "Yaradılan tarix obyekt:", untilDate);

      if (isNaN(untilDate.getTime())) {
        return res.status(400).json({ message: "Yanlış tarix formatı." });
      }

      user.isBlocked = true;
      user.blockUntil = untilDate;
    } else if (blockType === 'unblock') {
      user.isBlocked = false;
      user.blockUntil = null;
    } else {
      return res.status(400).json({ message: "Yanlış blockType dəyəri." });
    }

    await user.save();
    return res.status(200).json({ message: "Əməliyyat uğurla yerinə yetirildi." });
  } catch (error) {
    console.error("Bloklama zamanı xəta:", error);
    return res.status(500).json({ message: "Server xətası." });
  }
};







