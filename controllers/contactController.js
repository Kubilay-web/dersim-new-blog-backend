// Gerekli kütüphanelerin import edilmesi
import Contact from "../models/contactModel.js";
import dotenv from "dotenv";

// .env dosyasını yükleyin
dotenv.config();

export const submitContactForm = async (req, res) => {
  const { NameSurname, Email, Message } = req.body;

  const newContact = new Contact({
    nameSurname: NameSurname,
    email: Email,
    message: Message,
  });

  try {
    // Yeni iletişim formunu veritabanına kaydet
    await newContact.save();

    res.status(200).json({ message: "Succesfully saved to database" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error. Please try again." });
  }
};

export const getContactForms = async (req, res) => {
  try {
    // Veritabanından iletişim formlarını çek
    const contactForms = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contactForms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching contact forms." });
  }
};
