import mongoose from "mongoose";

// Ürün Schema'sı
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // Resim URL'si
  slug: { type: String, required: true, unique: true }, // URL dostu tanımlayıcı
});

// Ürün Modeli
const Product = mongoose.model("Product", productSchema);

export default Product;
