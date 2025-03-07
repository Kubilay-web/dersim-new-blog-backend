import cloudinary from "../cloudinary.js";
import Blog from "../models/blog.js";

// Tüm blogları veya belirli bir kategoriye ait blogları getir
const getBlogsByCategory = async (req, res) => {
  const { category, page = 0, limit = 10 } = req.query;

  try {
    let blogs;
    const skip = page * limit;

    if (category && category !== "all") {
      blogs = await Blog.find({ category });
    } else {
      blogs = await Blog.find().skip(skip).limit(parseInt(limit)).exec();
    }

    const totalBlogs = await Blog.countDocuments();
    res.json({ blogs, totalBlogs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Yeni blog oluştur
const createBlog = async (req, res) => {
  const { title, content, category, language, slug } = req.body;

  try {
    let uploadedImage = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      uploadedImage = result.secure_url; // Yüklenen resmin URL'si
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      language,
      slug,
      image: uploadedImage,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: "Blog oluşturulurken hata oluştu", error });
  }
};

// Blogu güncelle
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, language, slug } = req.body;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }

    let updatedImage = blog.image;

    if (req.file) {
      // Eski resmi sil
      if (blog.image) {
        const publicId = blog.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Yeni resmi yükle
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedImage = result.secure_url;
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.language = language || blog.language;
    blog.slug = slug || blog.slug; // Slug da manuel olarak güncellenebilir
    blog.image = updatedImage;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Blog güncellenirken hata oluştu", error });
  }
};

// Blogu sil
const deleteBlog = async (req, res) => {
  const { id } = req.params; // Blog ID'sini al

  try {
    // Blogu ID'ye göre bul
    const blog = await Blog.findById(id);

    // Eğer blog bulunamazsa hata mesajı döndür
    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }

    // Eğer blogda bir resim varsa Cloudinary'den sil
    if (blog.image) {
      try {
        const publicId = blog.image.split("/").pop().split(".")[0]; // Public ID'yi al
        await cloudinary.uploader.destroy(publicId); // Resmi sil
      } catch (cloudinaryError) {
        console.error("Cloudinary resmi silerken hata:", cloudinaryError);
        return res
          .status(500)
          .json({ message: "Resim silinirken hata oluştu", cloudinaryError });
      }
    }

    // Blogu veritabanından sil
    await Blog.deleteOne({ _id: id });

    // Başarı mesajı gönder
    res.json({ message: "Blog başarıyla silindi" });
  } catch (error) {
    console.error("Blog silinirken hata:", error);
    res.status(500).json({ message: "Blog silinirken hata oluştu", error });
  }
};

// Blog detayını getir
const getBlogById = async (req, res) => {
  const { slug } = req.params;

  try {
    // Blogu slug'a göre bul
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

export { getBlogsByCategory, createBlog, updateBlog, deleteBlog, getBlogById };
