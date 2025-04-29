import Add from "../Models/Addmodel.js";

// 1. Elanı yarat
export const CreateAd = async (req, res) => {
  try {
    const { name, price, category, city, about, phoneNumber, email } = req.body;

    if (!name || !price || !category || !city || !about || !email) {
      return res.status(400).send({ message: "Bütün sahələr tələb olunur" });
    }
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const mediaUrl = req.files
      ? req.files.map((file) => `${protocol}://${req.get("host")}/uploads/${file.filename}`)
      : [];
    
      
    const newAd = new Add({
      name,
      price,
      email,
      category,
      city,
      about,
      phoneNumber,
      images: mediaUrl,
      date: new Date(),
    });

    await newAd.save();
    res.status(201).send({ message: "Elan yaradıldı", ad: newAd });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Elan yaradılarkən xəta baş verdi", error: error.message });
  }
};

// 2. Bütün elanları gətir
export const getAllAds = async (req, res) => {
  try {
    const ads = await Add.find().sort({ date: -1 });
    res.status(200).send(ads);
  } catch (error) {
    res.status(500).send({ message: "Elanlar gətirilərkən xəta baş verdi", error: error.message });
  }
};

// 3. ID ilə elan
export const getAdById = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Add.findById(id);

    if (!ad) {
      return res.status(404).send({ message: "Elan tapılmadı" });
    }

    res.status(200).send(ad);
  } catch (error) {
    res.status(500).send({ message: "Elan gətirilərkən xəta baş verdi", error: error.message });
  }
};

export const getAdByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const ads = await Add.find({ email });

    if (!ads || ads.length === 0) {
      return res.status(404).send({ message: "Elan tapılmadı" });
    }

    res.status(200).send(ads);
  } catch (error) {
    console.error("Error while fetching ads by email:", error);
    res.status(500).send({ message: "Server xətası", error: error.message });
  }
};

export const addFavorite = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const ad = await Add.findById(id);
    if (!ad) return res.status(404).send({ message: "Elan tapılmadı" });

    const alreadyFavorited = ad.favorites.find(fav => fav.email === email);
    if (!alreadyFavorited) {
      ad.favorites.push({
        name: ad.name,
        email,
        phoneNumber: ad.phoneNumber,
        city: ad.city,
        category: ad.category,
        price: ad.price,
        images: ad.images,
        about: ad.about,
        favoritedAt: new Date()
      });
      await ad.save();
    }

    res.status(200).json({ message: "Favoritlərə əlavə edildi", ad });
  } catch (error) {
    console.error("Favoritə əlavə edilərkən xəta:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};

export const removeFavorite = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const ad = await Add.findById(id);
    if (!ad) return res.status(404).json({ message: "Elan tapılmadı" });

    ad.favorites = ad.favorites.filter(fav => fav.email !== email);
    await ad.save();

    res.status(200).json({ message: "Favoritlərdən silindi", ad });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};


export const getUserFavorites = async (req, res) => {
  const { email } = req.params;

  try {
    const ads = await Add.find({ "favorites.email": email });
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

