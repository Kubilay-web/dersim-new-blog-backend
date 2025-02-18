import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import subscribeRoutes from "../routes/subscribeRoutes.js";
import blogRoutes from "../routes/blogRoutes.js";
import userRoutes from "../routes/user.route.js";
import authRoutes from "../routes/auth.route.js";
import paymentRoutes from "../routes/paymentRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import postRoutes from "../routes/post.route.js";
import homePageRoute from "../routes/homePageRoute.js";
import contactRoute from "../routes/contact.route.js";
import contentRoute from "../routes/content.route.js";
import cookieParser from "cookie-parser";
import accordionRoute from "../routes/accordionRoutes.js";

dotenv.config();

const app = express();

// Middleware

app.use(
  cors({
    origin: "https://dersim-new-museum.vercel.app", // frontend'in çalıştığı domain (port)
    credentials: true, // cookies gönderimi için
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.log("MongoDB bağlantısı başarısız: ", err));

// API Routes
app.use("/api/subscribe", subscribeRoutes);
app.use("/api", blogRoutes);

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/post", postRoutes);
app.use("/api/home", homePageRoute);
app.use("/api/contact", contactRoute);
app.use("/api/contents", contentRoute);
app.use("/api/accordion", accordionRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Sunucu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor...`);
});
