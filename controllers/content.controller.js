import Content from "../models/content.model.js";

// Tüm yazıları getir
export const getContents = async (req, res) => {
  try {
    const contents = await Content.find(); // Bütün içerikleri getir
    res.status(200).json(contents); // 200 OK ile döndür
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err });
  }
};

// Bir yazıyı getir (ID ile)
export const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id); // ID'ye göre içerik getir
    if (!content) {
      return res.status(404).json({ message: "Yazı bulunamadı" });
    }
    res.status(200).json(content); // Bulunan içeriği döndür
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err });
  }
};

// Başlığa göre yazıları getir
// Başlığa göre yazıyı getir
export const getContentsByTitle = async (req, res) => {
  const title = req.params.title; // URL parametresinden başlık alınır

  try {
    // Başlığa göre içerik araması yap
    const content = await Content.findOne({ title: title });

    if (!content) {
      return res.status(404).json({ message: "Yazı bulunamadı" });
    }

    // Başlığa göre bulunan içeriği döndür
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err });
  }
};

// Yeni bir yazı oluştur
export const createContent = async (req, res) => {
  const { title, body } = req.body; // İstekten başlık ve gövdeyi al
  try {
    const newContent = new Content({ title, body }); // Yeni içerik oluştur
    await newContent.save(); // Veritabanına kaydet
    res.status(201).json(newContent); // 201 ile başarıyla oluşturulduğu içeriği döndür
  } catch (err) {
    res.status(400).json({ message: "Geçersiz veri", error: err });
  }
};

// Bir yazıyı güncelle
export const updateContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Güncel halini al
    });
    if (!content) {
      return res.status(404).json({ message: "Yazı bulunamadı" });
    }
    res.status(200).json(content); // Güncellenmiş içeriği döndür
  } catch (err) {
    res.status(400).json({ message: "Geçersiz veri", error: err });
  }
};

// Bir yazıyı sil
export const deleteContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id); // İçeriği sil
    if (!content) {
      return res.status(404).json({ message: "Yazı bulunamadı" });
    }
    res.status(200).json({ message: "Yazı başarıyla silindi" }); // Başarılı silme yanıtı
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err });
  }
};
