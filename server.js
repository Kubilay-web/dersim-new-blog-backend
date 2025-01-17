import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import subscribeRoutes from "./routes/subscribeRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.log("MongoDB bağlantısı başarısız: ", err));

// Mock Database

let products = [
  {
    _id: 1,
    name: "iPhone 12 Pro",
    brand: "Apple",
    desc: "6.1-inch display",
    price: 999,
    image:
      "https://res.cloudinary.com/dqqynqpwp/image/upload/v1733219632/dfbe0tmvhrcrgaczzrhn.jpg",
  },
  {
    _id: 2,
    name: "iPhone 12",
    brand: "Apple",
    desc: "5.4-inch mini display",
    price: 699,
    image:
      "https://res.cloudinary.com/dqqynqpwp/image/upload/v1733219631/lqnvvrzkxpoxbnjhcafd.png",
  },
  {
    _id: 3,
    name: "Galaxy S",
    brand: "Samsung",
    desc: "6.5-inch display",
    price: 399,
    image:
      "https://res.cloudinary.com/dqqynqpwp/image/upload/v1733219631/z6szavdiejzso9d9pj2n.jpg",
  },
];

app.get("/products", (req, res) => {
  res.json(products);
});

// API Routes
app.use("/api/subscribe", subscribeRoutes);
app.use("/api", blogRoutes);

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Sunucu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor...`);
});
