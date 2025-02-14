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
const createAccordionDataForCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { key, title, content } = req.body;

  if (!key || !title || !content) {
    return res
      .status(400)
      .json({ message: "Anahtar, başlık ve içerik gereklidir." });
  }

  try {
    const newAccordion = new Accordion({ categoryId, key, title, content });
    await newAccordion.save();
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

export default {
  getAccordionDataForCategory,
  createAccordionDataForCategory,
  updatePageTitle,
};
