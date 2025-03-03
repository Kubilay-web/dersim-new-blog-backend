import cloudinary from "../cloudinary.js";
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
// Slug oluşturma fonksiyonu
const createSlug = (title) => {
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, "") // Türkçe karakterlere izin ver
    .replace(/\s+/g, "-"); // Boşlukları tireye çevir

  const timestamp = Date.now(); // Benzersiz zaman damgası ekle
  return `${baseSlug}-${timestamp}`;
};

// Yeni post oluşturma
export const create = async (req, res, next) => {
  try {
    // Slug oluştur
    const slug = await createSlug(req.body.title);

    let uploadedImage = null;

    // Eğer resim dosyası varsa, Cloudinary'ye yükle
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      uploadedImage = result.secure_url; // Yüklenen resmin URL'si
    }

    // Yeni postu oluştur
    const newPost = new Post({
      ...req.body,
      slug,
      image: uploadedImage, // Resim URL'sini ekle
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

// Postları almak

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 1000;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
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

    // Format the date for each post before sending the response
    const formattedPosts = posts.map((post) => {
      // Check if date exists before applying formatting
      const formattedDate = post.date
        ? new Date(post.date).toLocaleDateString("tr-TR") // Adjust 'tr-TR' to your desired locale
        : null;
      return {
        ...post.toObject(),
        date: formattedDate, // Add the formatted date to the post object
      };
    });

    res.status(200).json({
      posts: formattedPosts,
      totalPosts,
    });
  } catch (error) {
    next(error);
  }
};

// Postu güncelleme
// Postu güncelleme
export const updatepost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Postu bul
    const post = await Post.findById(postId);

    if (!post) {
      return next(errorHandler(404, "Post bulunamadı"));
    }

    let updatedImage = post.image;
    let updatedColor = req.body.color || post.color; // Eğer yeni bir renk yoksa, eski renk kullanılacak

    // Yeni resim varsa, eskiyi sil ve yeni resmi yükle
    if (req.file) {
      if (post.image) {
        const publicId = post.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId); // Eski resmi Cloudinary'den sil
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      updatedImage = result.secure_url; // Yeni resmin URL'si
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: updatedImage,
          slug: req.body.slug, // Slug manuel olarak burada güncelleniyor
          color: updatedColor, // Renk güncelleniyor
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

// Postu silme
export const deletepost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Postu bul
    const post = await Post.findById(postId);

    if (!post) {
      return next(errorHandler(404, "Post bulunamadı"));
    }

    // Resim varsa, Cloudinary'den sil
    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json("Post başarıyla silindi");
  } catch (error) {
    next(error);
  }
};

// Kategoriye göre postları almak
export const getPostsByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category parametresi gerekli" });
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 1000;

    const posts = await Post.find({
      category,
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
    })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ category });

    res.status(200).json({
      posts,
      totalPosts,
    });
  } catch (error) {
    next(error);
  }
};

// Postları yeni kategoriye kopyalama
export const copyPostsToNewCategory = async (req, res, next) => {
  try {
    const { oldCategory, newCategory } = req.query;

    if (!oldCategory || !newCategory) {
      return res.status(400).json({
        message: "Eski kategori ve yeni kategori parametreleri gereklidir",
      });
    }

    const posts = await Post.find({ category: oldCategory });

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "Eski kategoride hiç post bulunamadı" });
    }

    const copiedPosts = [];
    for (const post of posts) {
      let baseSlug = post.slug;
      const uniqueId = Date.now();
      let newSlug = `${baseSlug}-${uniqueId}`;

      let existingPost = await Post.findOne({ slug: newSlug });
      while (existingPost) {
        newSlug = `${baseSlug}-${Date.now()}`;
        existingPost = await Post.findOne({ slug: newSlug });
      }

      const newPost = new Post({
        ...post.toObject(),
        category: newCategory,
        slug: newSlug,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        _id: undefined, // Yeni bir ID atanır
      });

      const savedPost = await newPost.save();
      copiedPosts.push(savedPost);
    }

    res.status(201).json({
      message: "Postlar başarıyla yeni kategoriye kopyalandı.",
      copiedPosts,
    });
  } catch (error) {
    next(error);
  }
};

// Slug'a göre postu almak

export const getPostBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    // Blogu slug'a göre bul
    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

export const updateCategoryName = async (req, res, next) => {
  try {
    const { oldCategory, updatedCategory } = req.body;

    if (!oldCategory || !updatedCategory) {
      return res.status(400).json({
        success: false,
        message: "Eski ve yeni kategori adı gereklidir.",
      });
    }

    // MongoDB'de kategori güncellemesi yap
    await Post.updateMany(
      { category: oldCategory },
      { $set: { category: updatedCategory } }
    );

    res.status(200).json({ success: true, updatedCategory });
  } catch (error) {
    next(error);
  }
};

//Silinecek aşağıdakiler

// Postları yeni kategoriye ve dile göre kopyalama
export const copyPostsToNewLanguage = async (req, res, next) => {
  try {
    const { oldLanguage, newLanguage } = req.query;

    // Eski ve yeni dil parametrelerinin olup olmadığını kontrol et
    if (!oldLanguage || !newLanguage) {
      return res.status(400).json({
        message: "Eski dil ve yeni dil parametreleri gereklidir",
      });
    }

    // Eski dildeki postları al
    const posts = await Post.find({ language: oldLanguage });

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: `Eski dilde (${oldLanguage}) hiç post bulunamadı` });
    }

    const copiedPosts = [];
    for (const post of posts) {
      let baseSlug = post.slug;
      const uniqueId = Date.now();
      let newSlug = `${baseSlug}-${uniqueId}`;

      // Slug benzersizliğini kontrol et ve gerekirse değiştir
      let existingPost = await Post.findOne({ slug: newSlug });
      while (existingPost) {
        newSlug = `${baseSlug}-${Date.now()}`;
        existingPost = await Post.findOne({ slug: newSlug });
      }

      // Yeni post oluştur ve boş alanları koru
      const newPost = new Post({
        ...post.toObject(),
        language: newLanguage, // Yeni dil ataması yapılır
        slug: newSlug,
        title: post.title || "", // Title yoksa boş string olarak bırak
        content: post.content || "", // Content yoksa boş string olarak bırak
        description: post.description || "", // Description yoksa boş bırak
        createdAt: Date.now(),
        updatedAt: Date.now(),
        _id: undefined, // Yeni bir ID atanır
      });

      const savedPost = await newPost.save();
      copiedPosts.push(savedPost);
    }

    res.status(201).json({
      message: `${oldLanguage} dilindeki postlar başarıyla ${newLanguage} diline kopyalandı.`,
      copiedPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlugsByLanguage = async (req, res, next) => {
  try {
    // English postlarını güncelle
    await Post.updateMany(
      {
        language: "english",
        slug: { $not: new RegExp("^/en/") }, // Sadece /en/ ile başlamayanları günceller
      },
      [
        {
          $set: {
            slug: {
              $cond: {
                if: { $regexMatch: { input: "$slug", regex: /^\/en\/\// } }, // Eğer /en// ile başlıyorsa
                then: {
                  $concat: [
                    "/en",
                    { $substr: ["$slug", 4, { $strLenBytes: "$slug" }] },
                  ],
                }, // /en/ kısmını düzelt
                else: { $concat: ["/en", "$slug"] }, // Başında yoksa /en/ ekle
              },
            },
          },
        },
      ]
    );

    // German postlarını güncelle
    await Post.updateMany(
      {
        language: "german",
        slug: { $not: new RegExp("^/ger/") },
      },
      [
        {
          $set: {
            slug: {
              $cond: {
                if: { $regexMatch: { input: "$slug", regex: /^\/ger\/\// } }, // Eğer /ger// ile başlıyorsa
                then: {
                  $concat: [
                    "/ger",
                    { $substr: ["$slug", 4, { $strLenBytes: "$slug" }] },
                  ],
                }, // /ger/ kısmını düzelt
                else: { $concat: ["/ger", "$slug"] }, // Başında yoksa /ger/ ekle
              },
            },
          },
        },
      ]
    );

    // Kurdish postlarını güncelle
    await Post.updateMany(
      {
        language: "kurdish",
        slug: { $not: new RegExp("^/kur/") },
      },
      [
        {
          $set: {
            slug: {
              $cond: {
                if: { $regexMatch: { input: "$slug", regex: /^\/kur\/\// } }, // Eğer /kur// ile başlıyorsa
                then: {
                  $concat: [
                    "/kur",
                    { $substr: ["$slug", 4, { $strLenBytes: "$slug" }] },
                  ],
                }, // /kur/ kısmını düzelt
                else: { $concat: ["/kur", "$slug"] }, // Başında yoksa /kur/ ekle
              },
            },
          },
        },
      ]
    );

    res.status(200).json({
      message: "Sluglar başarıyla dil kodlarına göre güncellendi.",
    });
  } catch (error) {
    next(error);
  }
};

// CategoryId'ye göre postları almak

export const getPostsByCategoryIdAndLanguage = async (req, res, next) => {
  try {
    const { categoryId, language } = req.query;

    if (!categoryId) {
      return res
        .status(400)
        .json({ message: "categoryId parametresi gereklidir" });
    }

    // Dil parametresi isteğe bağlı, eğer varsa filtrele
    const filter = {
      categoryId,
      ...(language && { language }), // Eğer dil parametresi varsa, filtreye ekle
    };

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 1000;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(filter);

    res.status(200).json({
      posts,
      totalPosts,
    });
  } catch (error) {
    next(error);
  }
};
