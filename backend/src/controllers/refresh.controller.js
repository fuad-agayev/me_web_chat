import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { signAccessToken, verifyRefreshToken } from "../utils/jwt.js";

export const refresh = (req, res) => {
  try {
    // 🔥 cookie’den refresh token al
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // 🔥 refresh token doğrula
    //const decoded = jwt.verify(refreshToken, env.REFRESH_SECRET);
// ✅ refresh token doğrula
//?   -----Yetki kontrolü her zaman access token üzerinden yapılır, refresh token sadece yeni access token üretmek için vardır.
//?  -----Yetki kontrolu her zman ACCCESTOKEN ile yapilir --->  VerifyaccesToekn midlleware  o yuzden o varda orda  
//?  ----VE bu verifyRefresshToken middleware de o yuzden kullanilmiyor verifyAccesToken gibi ords  MANTIINI ANLADINMI UNUTMAAAAAAAAA
//? ----- Yani refresh token doğrudan yetki kontrolü için kullanılmaz, sadece yeni access token üretir.
    const decoded = verifyRefreshToken(refreshToken);

    // 🔥 yeni access token üret
    const newAccessToken = signAccessToken({
      id: decoded.id
    });

    // 🔥 cookie’ye tekrar yaz
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 20
    });

    return res.json({
      message: "Access token refreshed"
    });

  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired refresh token"
    });
  }
};

