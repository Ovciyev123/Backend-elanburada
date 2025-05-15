import Listing from "../Models/Addmodel.js";


// 1. Elan Yaratma
export const CreateAd = async (req, res) => {
  try {
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
      mapAddress,
      repairStatus,
      hasExtract,
      hasMortgage,
      rentTypeMonthly,
      rentTypeDaily,
      isAgent
    } = req.body;

    // Bütün gerekli alanların doğrulaması
    if (!name || !price || !category || !city || !address || !email || !dealType || !area) {
      return res.status(400).send({ message: "Bütün sahələr tələb olunur" });
    }

    // Ekstra alanlar
    if (!repairStatus) repairStatus = '';  // Varsayılan değer
    if (hasExtract === undefined) hasExtract = false;  // Varsayılan değer
    if (hasMortgage === undefined) hasMortgage = false;  // Varsayılan değer
    if (rentTypeMonthly === undefined) rentTypeMonthly = false;  // Varsayılan değer
    if (rentTypeDaily === undefined) rentTypeDaily = false;  // Varsayılan değer
    if (isAgent === undefined) isAgent = true;  // Varsayılan değer

    // Medya dosyaları (resimler)
    const mediaUrl = req.files ? req.files.map((file) => file.path) : [];

    // Yeni ilan nesnesini oluşturuyoruz
    const newAd = new Listing({
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
      images: mediaUrl,
      region,
      settlement,
      mapAddress,
      repairStatus,
      hasExtract,
      hasMortgage,
      rentTypeMonthly,
      rentTypeDaily,
      isAgent,
      createdAt: new Date()
    });

    // Yeni ilanı kaydediyoruz
    await newAd.save();
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
  const { id } = req.params;

  const {email}=req.body

  try {
    const ad = await Listing.findById(id);
    if (!ad) return res.status(404).send({ message: "Elan tapılmadı" });

    const alreadyFavorited = ad.favorites.find(fav => fav.email === email);
    if (!alreadyFavorited) {
      ad.favorites.push({
        region: ad.region,
        settlement: ad.settlement,
        mapAddress: ad.mapAddress,
        address: ad.address,
        images: ad.images,
        name: ad.name,
        isAgent: ad.isAgent,
        email: email,
        phone: ad.phone,
        dealType: ad.dealType,
        category: ad.category,
        city: ad.city,
        rooms: ad.rooms,
        area: ad.area,
        floor: ad.floor,
        totalFloors: ad.totalFloors,
        additionalInfo: ad.additionalInfo,
        price: ad.price,
        repairStatus: ad.repairStatus,
        hasExtract: ad.hasExtract,
        hasMortgage: ad.hasMortgage,
        rentTypeMonthly: ad.rentTypeMonthly,
        rentTypeDaily: ad.rentTypeDaily,
        favoritedAt: new Date()
      });

      await ad.save();
    }

    res.status(200).json({ message: "Favoritə əlavə edildi", ad });
  } catch (error) {
    console.error("Favoritə əlavə edilərkən xəta:", error);
    res.status(500).json({ message: "Server xətası" });
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
