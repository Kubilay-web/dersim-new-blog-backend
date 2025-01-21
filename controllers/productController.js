import cloudinary from "../cloudinary.js";
import Product from "../models/product.js";

// Yeni ürün oluştur
const createProduct = async (req, res) => {
  const { name, brand, description, price, slug } = req.body;

  try {
    let uploadedImage = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      uploadedImage = result.secure_url; // Yüklenen resmin URL'si
    }

    const newProduct = new Product({
      name,
      brand,
      description,
      price,
      slug,
      image: uploadedImage,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Ürün oluşturulurken hata oluştu", error });
  }
};

// Ürünü güncelle
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, brand, description, price, slug } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    let updatedImage = product.image;

    if (req.file) {
      // Eski resmi sil
      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Yeni resmi yükle
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedImage = result.secure_url;
    }

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.price = price || product.price;
    product.slug = slug || product.slug;
    product.image = updatedImage;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Ürün güncellenirken hata oluştu", error });
  }
};

// Ürünü sil
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    if (product.image) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary resmi silerken hata:", cloudinaryError);
        return res
          .status(500)
          .json({ message: "Resim silinirken hata oluştu", cloudinaryError });
      }
    }

    await Product.deleteOne({ _id: id });
    res.json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    console.error("Ürün silinirken hata:", error);
    res.status(500).json({ message: "Ürün silinirken hata oluştu", error });
  }
};

// Ürün detayını getir
const getProductById = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.json(products); // Return the list of products as a JSON response
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ürünler getirilirken hata oluştu", error });
  }
};

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
};
