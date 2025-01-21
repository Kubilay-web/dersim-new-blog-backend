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
import productRoutes from "./routes/productRoutes.js";
import puppeteer from "puppeteer";

dotenv.config();

const app = express();

// Middleware

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

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
app.use("/api/products", productRoutes);

const pageSchema = new mongoose.Schema({
  path: String,
  title: String,
  content: String,
});

const Page = mongoose.model("Page", pageSchema);

// Sayfa verilerini çekme ve MongoDB'ye kaydetme
app.get("/api/pages", async (req, res) => {
  try {
    const pages = await scrapePages(); // Sayfa verilerini çekiyoruz
    // Veritabanında zaten var olmayan sayfaları ekliyoruz
    const newPages = [];
    for (const page of pages) {
      const existingPage = await Page.findOne({ title: page.title });

      // Eğer sayfa yoksa, yeni sayfayı ekliyoruz
      if (!existingPage) {
        newPages.push(page);
        await Page.create(page); // Veritabanına yeni sayfayı ekliyoruz
      }
    }

    res.json(pages); // Kaydedilen sayfa verilerini geri döndürüyoruz
  } catch (error) {
    console.error("Sayfalar çekilirken hata oluştu: ", error);
    res.status(500).send("Sayfalar çekilirken bir hata oluştu");
  }
});

// Puppeteer ile sayfa verilerini çekme ve veritabanında kontrol etme
const scrapePages = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const urls = ["http://localhost:3000"]; // URL listesini burada tanımlayabilirsiniz

  const pageData = [];

  // Sayfaları sırayla çekmek için for döngüsünü kullanıyoruz
  for (const url of urls) {
    try {
      // Veritabanında bu URL'ye ait bir sayfa olup olmadığını kontrol et
      const existingPage = await Page.findOne({ path: url });

      // Eğer sayfa zaten varsa, bu sayfayı geç
      if (existingPage) {
        console.log(`Sayfa zaten veritabanında mevcut: ${url}`);
        continue; // Bu sayfayı atla
      }

      // Sayfa verisini çek
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const data = await page.evaluate(() => {
        const title =
          document.querySelector("title")?.innerText || "Başlık Bulunamadı";
        const content =
          document.querySelector("body")?.innerText || "İçerik Bulunamadı";
        return { path: window.location.pathname, title, content };
      });

      pageData.push(data); // Veriyi array'e ekliyoruz
    } catch (error) {
      console.error(`Hata: ${url} sayfası çekilirken bir problem oluştu`);
    }
  }

  await browser.close();
  return pageData;
};

// Sunucu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor...`);
});
