import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Token doğrulama middleware'i
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Cookie'den token alınır

  if (!token) {
    return next(errorHandler(401, "Unauthorized")); // Token yoksa, yetkisiz erişim
  }

  // JWT'yi doğrula
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized")); // Token hatalıysa, yetkisiz
    }

    req.user = user; // Kullanıcı bilgilerini request objesine ekle
    next(); // Middleware zincirini devam ettir
  });
};
