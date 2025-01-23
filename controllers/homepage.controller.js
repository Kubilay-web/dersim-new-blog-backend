import Homepage from "../models/homepage.model.js";

// Anasayfa verilerini almak
export const getHomepage = async (req, res, next) => {
  try {
    const homepage = await Homepage.findOne(); // Sadece tek bir veri var
    if (!homepage) {
      return res.status(404).json({ message: "Anasayfa verisi bulunamadı." });
    }
    res.status(200).json(homepage);
  } catch (error) {
    next(error);
  }
};

// Anasayfa verisini oluşturmak (POST)
export const createHomepage = async (req, res, next) => {
  try {
    const { videoLink, title1, title2, title3, title4, title5, title6 } =
      req.body;

    // Yeni anasayfa verisini oluştur
    const newHomepage = new Homepage({
      videoLink,
      title1,
      title2,
      title3,
      title4,
      title5,
      title6,
    });

    const savedHomepage = await newHomepage.save();

    res.status(201).json(savedHomepage); // 201 Created döner
  } catch (error) {
    next(error);
  }
};

// Anasayfa verilerini güncellemek (PUT)
export const updateHomepage = async (req, res, next) => {
  try {
    const { title, videoLink, title1, title2, title3, title4, title5, title6 } =
      req.body;

    // Anasayfa verisini bul ve güncelle
    const updatedHomepage = await Homepage.findOneAndUpdate(
      {},
      {
        $set: {
          title,
          videoLink,
          title1,
          title2,
          title3,
          title4,
          title5,
          title6,
        },
      },
      { new: true, upsert: true } // Eğer veri yoksa yeni bir tane oluştur
    );

    res.status(200).json(updatedHomepage);
  } catch (error) {
    next(error);
  }
};
