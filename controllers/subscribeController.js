import Subscription from "../models/subscriptionModel.js";

// E-posta formatı doğrulaması için regex
const validateEmailFormat = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const subscribeController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email adresi gereklidir." });
  }

  if (!validateEmailFormat(email)) {
    return res.status(400).json({ message: "Geçersiz e-posta adresi." });
  }

  try {
    // E-posta zaten mevcut mu kontrol et
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res
        .status(400)
        .json({ message: "Bu e-posta adresi zaten kayıtlı." });
    }

    // Veriyi MongoDB'ye kaydetme
    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    res.status(200).json({ message: "Başarıyla abone oldunuz!" });
  } catch (error) {
    console.error("Abone olma hatası: ", error);
    res.status(500).json({ message: "Bir hata oluştu." });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    // Fetch all subscriptions from the database
    const subscriptions = await Subscription.find();

    // Return the list of subscriptions
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Abonelikleri listeleme hatası: ", error);
    res.status(500).json({ message: "Bir hata oluştu." });
  }
};

export { subscribeController, getSubscriptions };
