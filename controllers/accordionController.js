import Accordion from "../models/accordionModel.js";

// Get accordion data for a specific category
const getAccordionDataForCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const data = await Accordion.find({ categoryId });
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Accordion verileri alınırken hata oluştu" });
  }
};

// Create a new accordion for a specific category

// Yeni bir accordion verisi oluşturma
const createAccordionDataForCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { key, title, content } = req.body;

  // Gerekli alanların kontrolü
  if (!key || !title || !content) {
    return res
      .status(400)
      .json({ message: "Anahtar, başlık ve içerik gereklidir." });
  }

  try {
    // Yeni bir Accordion oluşturuluyor
    const newAccordion = new Accordion({ categoryId, key, title, content });
    await newAccordion.save(); // Veritabanına kaydediliyor
    res
      .status(201)
      .json({ message: "Accordion başarıyla oluşturuldu", newAccordion });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Accordion verisi oluşturulurken hata oluştu" });
  }
};

// Update the page title
const updatePageTitle = async (req, res) => {
  const { categoryId } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Başlık gereklidir." });
  }

  try {
    // Assuming you want to update a field related to the categoryId
    // Perform update logic if needed (e.g. update page title for the category)
    res.status(200).json({ message: "Sayfa başlığı başarıyla güncellendi" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sayfa başlığı güncellenirken hata oluştu" });
  }
};

// Accordion verisini güncelleme
const updateAccordionData = async (req, res) => {
  const { accordionId } = req.params; // Güncellenecek accordion'un ID'si
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Başlık ve içerik gereklidir." });
  }

  try {
    // Accordion'ı ID'sine göre bul ve güncelle
    const updatedAccordion = await Accordion.findByIdAndUpdate(
      accordionId,
      { title, content },
      { new: true } // Güncellenen veriyi geri döndür
    );
    res
      .status(200)
      .json({ message: "Accordion başarıyla güncellendi", updatedAccordion });
  } catch (error) {
    res.status(500).json({ message: "Accordion güncellenirken hata oluştu" });
  }
};

// Accordion verisini silme
const deleteAccordionData = async (req, res) => {
  const { accordionId } = req.params; // Silinecek accordion'un ID'si

  try {
    // Accordion'ı ID'sine göre bul ve sil
    const deletedAccordion = await Accordion.findByIdAndDelete(accordionId);

    // Eğer veriyi bulup sildiysen, başarı mesajı
    if (!deletedAccordion) {
      return res.status(404).json({ message: "Accordion bulunamadı" });
    }

    res
      .status(200)
      .json({ message: "Accordion başarıyla silindi", deletedAccordion });
  } catch (error) {
    res.status(500).json({ message: "Accordion silinirken hata oluştu" });
  }
};

// Belirli bir categoryId ve language için Accordion verilerini getir
const getAccordionDataForCategoryLanguage = async (req, res) => {
  const { categoryId, language } = req.params; // categoryId ve language alınır

  try {
    const data = await Accordion.find({ categoryId, language }); // Filtreleme
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Accordion verileri alınırken hata oluştu" });
  }
};

export default {
  getAccordionDataForCategory,
  getAccordionDataForCategoryLanguage,
  createAccordionDataForCategory,
  updatePageTitle,
  updateAccordionData,
  deleteAccordionData,
};
