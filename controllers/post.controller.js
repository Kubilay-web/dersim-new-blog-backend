import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

const createSlug = (title) => {
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, "") // Türkçe karakterlere izin ver
    .replace(/\s+/g, "-"); // Boşlukları tireye çevir

  const timestamp = Date.now(); // Benzersiz zaman damgası ekle
  return `${baseSlug}-${timestamp}`;
};

export const create = async (req, res, next) => {
  try {
    // Benzersiz slug oluştur
    const slug = await createSlug(req.body.title);

    const newPost = new Post({
      ...req.body,
      slug,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 1000;
    const sortDirection = req.query.order === "asc" ? 1 : -1; // Bu kısım, hala kullanılabilir. Ama sort alanını değiştirdik.

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.content && { _id: req.query.content }),
      ...(req.query.blogContent && { _id: req.query.blogContent }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: 1 })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;

    // `category` zorunlu hale getirildi
    if (!category) {
      return res.status(400).json({ message: "Category parametresi gerekli" });
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 1000; // Varsayılan limit 60

    const posts = await Post.find({
      category, // Belirtilen category'e göre filtreleme yapılıyor
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: -1 }) // En son eklenen postlar en üstte olacak şekilde sıralama
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ category }); // Belirtilen category'e göre toplam post sayısını al

    res.status(200).json({
      posts,
      totalPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          blogContent: req.body.blogContent,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const copyPostsToNewCategory = async (req, res, next) => {
  try {
    const { oldCategory, newCategory } = req.query;

    if (!oldCategory || !newCategory) {
      return res.status(400).json({
        message: "Eski kategori ve yeni kategori parametreleri gereklidir",
      });
    }

    // Eski kategorideki postları bul
    const posts = await Post.find({ category: oldCategory });

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "Eski kategoride hiç post bulunamadı" });
    }

    // Yeni kategoriye ait postların olup olmadığını kontrol et
    const copiedPosts = [];
    for (const post of posts) {
      // Post'un mevcut slug bilgisini al
      let baseSlug = post.slug;

      // Benzersiz numara eklemek için zaman damgası kullan
      const uniqueId = Date.now(); // Benzersiz sayısal ID (zaman damgası)

      // Dinamik slug oluştur (post slug + benzersiz ID)
      let newSlug = `${baseSlug}-${uniqueId}`;

      // Slug'ın benzersizliğini kontrol et
      let existingPost = await Post.findOne({ slug: newSlug });
      while (existingPost) {
        // Eğer slug benzersiz değilse, yeni bir benzersiz ID ekle
        const uniqueId = Date.now();
        newSlug = `${baseSlug}-${uniqueId}`;
        existingPost = await Post.findOne({ slug: newSlug });
      }

      // Yeni postu oluştur
      const newPost = new Post({
        ...post.toObject(),
        category: newCategory, // Yeni kategori
        slug: newSlug, // Benzersiz slug
        createdAt: Date.now(),
        updatedAt: Date.now(),
        _id: undefined, // Yeni bir ID atanır
      });

      const savedPost = await newPost.save();
      copiedPosts.push(savedPost);
    }

    res.status(201).json({
      message: "Posts successfully copied to the new category.",
      copiedPosts,
    });
  } catch (error) {
    next(error);
  }
};
