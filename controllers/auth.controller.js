import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};

// export const signin = async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password || email === "" || password === "") {
//     next(errorHandler(400, "All fields are required"));
//   }

//   try {
//     const validUser = await User.findOne({ email });
//     if (!validUser) {
//       return next(errorHandler(404, "User not found"));
//     }
//     const validPassword = bcryptjs.compareSync(password, validUser.password);
//     if (!validPassword) {
//       return next(errorHandler(400, "Invalid password"));
//     }
//     const token = jwt.sign(
//       { id: validUser._id, isAdmin: validUser.isAdmin },
//       process.env.JWT_SECRET
//     );

//     console.log(token);

//     const { password: pass, ...rest } = validUser._doc;

//     res
//       .status(200)
//       .cookie("access_token", token, {
//         httpOnly: true,
//       })
//       .json(rest);
//   } catch (error) {
//     next(error);
//   }
// };

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token geçerlilik süresi (1 saat)
    );

    // Password'ü response'dan hariç tutalım
    const { password: pass, ...rest } = validUser._doc;

    // Cookie'yi tarayıcıya gönderiyoruz
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true, // Client-side JavaScript ile erişilemez
        secure: process.env.NODE_ENV === "production", // Prod ortamında güvenli (HTTPS)
        sameSite: "Strict", // CSRF saldırılarına karşı koruma
        maxAge: 3600000, // Cookie'nin geçerlilik süresi (1 saat)
      })
      .json(rest); // Başarılı kullanıcı bilgilerini gönder
  } catch (error) {
    next(error);
  }
};
