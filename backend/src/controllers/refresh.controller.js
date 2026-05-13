import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { signAccessToken } from "../utils/jwt.js";

export const refresh = (req, res) => {
  try {
    // 🔥 cookie’den refresh token al
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // 🔥 refresh token doğrula
    const decoded = jwt.verify(refreshToken, env.REFRESH_SECRET);

    // 🔥 yeni access token üret
    const newAccessToken = signAccessToken({
      id: decoded.id
    });

    // 🔥 cookie’ye tekrar yaz
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
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
