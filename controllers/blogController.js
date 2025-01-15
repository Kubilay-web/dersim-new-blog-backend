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
  const { title, content, category } = req.body;

  try {
    const newBlog = new Blog({
      title,
      content,
      category,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
};

// Blogu güncelle
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, category },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

// Blogu sil
const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
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
