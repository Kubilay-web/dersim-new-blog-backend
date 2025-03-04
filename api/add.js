// import mongoose from "mongoose";
// import Post from "../models/post.model.js";

// // Kategorilere göre categoryId atama
// const assignCategoryId = async () => {
//   try {
//     // MongoDB'ye bağlan
//     await mongoose.connect(
//       "mongodb+srv://Kubilay:YdhTouCOUkYwEIKQ@cluster0.gk3lmtj.mongodb.net/dersim?retryWrites=true&w=majority&appName=Cluster0",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );

//     // Türkçe ve İngilizce kategoriler için dinamik categoryId oluşturma
//     const languages = ["turkish", "german", "kurdish"];

//     // Kategorilere göre benzersiz categoryId atama
//     for (const language of languages) {
//       // Dil bazında postları bul
//       const categories = await Post.distinct("category", { language });

//       let index = 1; // Benzersiz categoryId'yi başlatacak sayaç

//       // Her kategoriye benzersiz categoryId oluştur
//       for (const categoryName of categories) {
//         // categoryName'den benzersiz categoryId oluştur
//         const categoryId = `${language}-${index}`; // "english-1", "english-2", vb.

//         // Kategorisi belirli olan tüm postları bul ve categoryId'yi güncelle
//         const result = await Post.updateMany(
//           {
//             language,
//             category: categoryName, // Kategorisi eşleşen postları bul
//           },
//           {
//             $set: { categoryId }, // categoryId'yi güncelle
//           }
//         );

//         console.log(
//           `${categoryName} kategorisindeki ${result.nModified} post için categoryId: ${categoryId} olarak güncellendi.`
//         );

//         index++; // Bir sonraki kategori için sayacı artır
//       }
//     }

//     mongoose.disconnect(); // Bağlantıyı kapat
//   } catch (error) {
//     console.error("Hata oluştu:", error);
//     mongoose.disconnect();
//   }
// };

// // Scripti çalıştır
// assignCategoryId();

import mongoose from "mongoose";
import Accordion from "../models/accordionModel.js"; // Yeni şemayı kullanıyoruz

const assignAccordionId = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(
      "mongodb+srv://Kubilay:YdhTouCOUkYwEIKQ@cluster0.gk3lmtj.mongodb.net/dersim?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Desteklenen diller
    const languages = ["turkish", "german", "english", "kurdish", "zazaki"];

    // Tüm benzersiz başlıkları (`title`) al
    const titles = await Accordion.distinct("title");

    let index = 1; // Başlıklara özel numaralandırma

    for (const title of titles) {
      // Her dil için aynı numarayı kullanarak accordionId oluştur
      for (const language of languages) {
        const accordionId = `${language}-accordion-${index}`; // Yeni accordionId formatı

        // Aynı başlığa sahip tüm belgeleri güncelle
        const result = await Accordion.updateMany(
          { title, language },
          { $set: { accordionId } } // contentId yerine accordionId kullanıldı
        );

        console.log(
          `"${title}" başlıklı (${language}) içerikte ${result.modifiedCount} kayıt için accordionId "${accordionId}" olarak güncellendi.`
        );
      }
      index++; // Bir sonraki başlık için numarayı artır
    }

    mongoose.disconnect(); // Bağlantıyı kapat
    console.log("Güncelleme tamamlandı!");
  } catch (error) {
    console.error("Hata oluştu:", error);
    mongoose.disconnect();
  }
};

// Scripti çalıştır
assignAccordionId();
