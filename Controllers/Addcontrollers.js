import Listing from "../Models/Addmodel.js";


// 1. Elan Yaratma
export const CreateAd = async (req, res) => {
  try {
    console.log("Request received for creating an ad");

    // Verileri alalım
    const {
      name,
      price,
      category,
      city,
      address,
      phone,
      email,
      dealType,
      area,
      rooms,
      floor,
      totalFloors,
      additionalInfo,
      images,
      region,
      settlement,
      mapAddress
    } = req.body;

    // Eksik alan kontrolü ve loglama
    console.log("Request body:", req.body);
    if (!name || !price || !category || !city || !address || !email || !dealType || !area) {
      console.log("Missing required fields:", {
        name,
        price,
        category,
        city,
        address,
        email,
        dealType,
        area,
      });
      return res.status(400).send({ message: "Bütün sahələr tələb olunur" });
    }

    // Medya (resimler) kontrolü
    console.log("Request files:", req.files);
    const mediaUrl = req.files ? req.files.map((file) => file.path) : [];
    console.log("Media URLs:", mediaUrl);

    // Yeni ilanı yaratma
    const newAd = new Listing({
      name,
      price,
      email,
      dealType,
      category,
      city,
      address,
      phone,
      region,
      settlement,
      mapAddress,
      area,
      rooms,
      floor,
      totalFloors,
      additionalInfo,
      images: mediaUrl,
      createdAt: new Date(),
    });

    console.log("Saving new ad:", newAd);
    await newAd.save();

    console.log("Ad created successfully:", newAd);
    res.status(201).send({ message: "Elan yaradıldı", ad: newAd });
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).send({ message: "Elan yaradılarkən xəta baş verdi", error: error.message });
  }
};

// 2. Bütün Elanları Getir
export const getAllAds = async (req, res) => {
  try {
    const ads = await Listing.find().sort({ createdAt: -1 });
    res.status(200).send(ads);
  } catch (error) {
    res.status(500).send({ message: "Elanlar gətirilərkən xəta baş verdi", error: error.message });
  }
};

// 3. ID ilə Elan
export const getAdById = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Listing.findById(id);

    if (!ad) {
      return res.status(404).send({ message: "Elan tapılmadı" });
    }

    res.status(200).send(ad);
  } catch (error) {
    res.status(500).send({ message: "Elan gətirilərkən xəta baş verdi", error: error.message });
  }
};

// 4. İstifadəçi üzrə Elanları Getir
export const getAdByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const ads = await Listing.find({ email });

    if (!ads || ads.length === 0) {
      return res.status(404).send({ message: "Elan tapılmadı" });
    }

    res.status(200).send(ads);
  } catch (error) {
    console.error("Email ilə elanlar gətirilərkən xəta:", error);
    res.status(500).send({ message: "Server xətası", error: error.message });
  }
};

// 5. Favori Ekleme
export const addFavorite = async (req, res) => {
  const { id } = req.params; // Elan ID'si
  const { email } = req.body; // Favori ekleyen kullanıcı emaili

  try {
    const ad = await Listing.findById(id);
    if (!ad) return res.status(404).send({ message: "Elan tapılmadı" });

    // Kullanıcı favorilerine zaten eklemişse kontrol
    const alreadyFavorited = ad.favorites.find(fav => fav.email === email);
    if (!alreadyFavorited) {
      ad.favorites.push({
        name: ad.name,
        price: ad.price,
        category: ad.category,
        city: ad.city,
        address: ad.address,
        phone: ad.phone,
        email: ad.email,
        dealType: ad.dealType,
        area: ad.area,
        rooms: ad.rooms,
        floor: ad.floor,
        totalFloors: ad.totalFloors,
        additionalInfo: ad.additionalInfo,
        images: ad.images,
        region: ad.region,
        settlement: ad.settlement,
        mapAddress: ad.mapAddress,
        favoritedAt: new Date()
      });
      await ad.save();
    }

    res.status(200).json({ message: "Favorilere eklendi", ad });
  } catch (error) {
    console.error("Favoriye eklenirken hata:", error);
    res.status(500).json({ message: "Server hatası" });
  }
};


// 6. Favorilerden Çıkarma
export const removeFavorite = async (req, res) => {
  const { id } = req.params; // Elan ID'si
  const { email } = req.body; // Favoriden çıkarılacak kullanıcı emaili

  try {
    const ad = await Listing.findById(id);
    if (!ad) return res.status(404).json({ message: "Elan tapılmadı" });

    // Favorilerden çıkarma
    ad.favorites = ad.favorites.filter(fav => fav.email !== email);
    await ad.save();

    res.status(200).json({ message: "Favorilerden silindi", ad });
  } catch (error) {
    res.status(500).json({ message: "Server hatası" });
  }
};

// 7. Kullanıcının Favorilerini Getir
export const getUserFavorites = async (req, res) => {
  const { email } = req.params; // Kullanıcı emaili

  try {
    const ads = await Listing.find({ "favorites.email": email });
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Server hatası" });
  }
};

// 8. Tüm Favorileri Temizle
export const clearFavorites = async (req, res) => {
  const { id } = req.params; // Favorileri temizleyecek ilan ID'si

  try {
    const ad = await Listing.findById(id);
    if (!ad) return res.status(404).json({ message: "Elan tapılmadı" });

    ad.favorites = [];  // Tüm favorileri temizle
    await ad.save();

    res.status(200).json({ message: "Tüm favoriler silindi", ad });
  } catch (error) {
    console.error("Favoriler silinirken hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
