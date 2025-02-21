import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import cloudinary from "../cloudinary.js";

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

// export const updateUser = async (req, res, next) => {
//   try {
//     if (req.user.id !== req.params.userId) {
//       return next(errorHandler(403, "You are not allowed to update this user"));
//     }

//     const updates = {};

//     // Username Validation
//     if (req.body.username) {
//       if (req.body.username.length < 7 || req.body.username.length > 20) {
//         return next(
//           errorHandler(400, "Username must be between 7 and 20 characters")
//         );
//       }
//       if (req.body.username.includes(" ")) {
//         return next(errorHandler(400, "Username cannot contain spaces"));
//       }
//       if (req.body.username !== req.body.username.toLowerCase()) {
//         return next(errorHandler(400, "Username must be lowercase"));
//       }
//       if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
//         return next(
//           errorHandler(400, "Username can only contain letters and numbers")
//         );
//       }
//       const usernameExists = await User.findOne({
//         username: req.body.username,
//       });
//       if (usernameExists && usernameExists._id.toString() !== req.user.id) {
//         return next(errorHandler(400, "Username already taken"));
//       }
//       updates.username = req.body.username;
//     }

//     // Email Validation
//     if (req.body.email) {
//       const emailExists = await User.findOne({ email: req.body.email });
//       if (emailExists && emailExists._id.toString() !== req.user.id) {
//         return next(errorHandler(400, "Email already taken"));
//       }
//       updates.email = req.body.email;
//     }

//     // Profile Picture
//     if (req.body.profilePicture) {
//       updates.profilePicture = req.body.profilePicture;
//     }

//     // Password Validation and Update
//     if (req.body.password) {
//       if (req.body.password.length < 6) {
//         return next(
//           errorHandler(400, "Password must be at least 6 characters")
//         );
//       }
//       const validUser = await User.findById(req.params.userId);
//       const validPassword = bcryptjs.compareSync(
//         req.body.password,
//         validUser.password
//       );
//       if (validPassword) {
//         return next(
//           errorHandler(400, "New password cannot be the same as the old one")
//         );
//       }
//       updates.password = bcryptjs.hashSync(req.body.password, 10);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.userId,
//       { $set: updates },
//       { new: true }
//     );

//     const { password, ...rest } = updatedUser._doc;

//     res.status(200).json(rest);
//   } catch (error) {
//     next(error);
//   }
// };

// user.controller.js

export const updateUser = async (req, res, next) => {
  try {
    // Eğer kullanıcı güncellenmeye çalışıyorsa, kimlik doğrulama kontrolü
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this user")); // Yetkisiz kullanıcı hatası
    }

    const updates = {}; // Güncellenmesi gereken alanları burada saklayacağız

    // Kullanıcı adı doğrulaması
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          errorHandler(400, "Username must be between 7 and 20 characters")
        );
      }
      if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, "Username must be lowercase"));
      }

      // Kullanıcı adı veritabanında kontrol
      const usernameExists = await User.findOne({
        username: req.body.username,
      });
      if (usernameExists && usernameExists._id.toString() !== req.user.id) {
        return next(errorHandler(400, "Username already taken"));
      }

      updates.username = req.body.username; // Güncelleme
    }

    // E-posta doğrulaması
    if (req.body.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists && emailExists._id.toString() !== req.user.id) {
        return next(errorHandler(400, "Email already taken"));
      }
      updates.email = req.body.email; // Güncelleme
    }

    // Profil fotoğrafı yükleme
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles", // Profil resimleri için bulut klasörü
      });
      updates.profilePicture = result.secure_url; // Profil fotoğrafı URL'si
    }

    // Şifre güncelleme
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters")
        );
      }

      // Eski şifreyle yeni şifreyi kontrol et
      const validUser = await User.findById(req.params.userId);
      const validPassword = bcryptjs.compareSync(
        req.body.password,
        validUser.password
      );
      if (validPassword) {
        return next(
          errorHandler(400, "New password cannot be the same as the old one")
        );
      }

      // Yeni şifreyi hashle
      updates.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Kullanıcıyı güncelleme işlemi
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true } // Yeni güncellenmiş veriyi döndür
    );

    const { password, ...rest } = updatedUser._doc; // Şifreyi dışarıda bırakıyoruz
    res.status(200).json(rest); // Güncellenmiş kullanıcı bilgilerini döndürüyoruz
  } catch (error) {
    next(error); // Hata varsa, hata handler'ına yönlendirme
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    // Çerezi temizle
    res.clearCookie("access_token", {
      httpOnly: true, // Çerezin sadece HTTP isteğiyle erişilebilir olmasını sağlar
      sameSite: "strict", // Aynı site politikası
    });

    // Yanıt döndür
    res.status(200).json({ message: "User has been signed out" });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
