
import { verifyAccessToken} from '../utils/jwt.js';

export const auth = (req, res, next) => {
console.log("=================================");
    console.log("URL:", req.originalUrl);
   
    console.log("Cookies:", req.cookies);

    const token = req.cookies.access_token;

    console.log("Access Token:", token);

    if (!token) {
        console.log("Token yok");
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = verifyAccessToken(token);

        console.log("Decoded:", decoded);

        req.user = decoded;

        next();

    } catch (err) {

        console.log("JWT Error:", err);

        return res.status(401).json({
            error: "Invalid & expired token"
        });
    }
};