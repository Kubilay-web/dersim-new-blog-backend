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
