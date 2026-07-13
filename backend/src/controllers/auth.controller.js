import { registerUser, loginUser } from '../services/auth.service.js';
import { transporter } from '../config/mail.js';
import { pool } from '../config/db.js';
import { UserModel } from '../models/user.model.js';
import { env } from '../config/env.js';

export const register = async (req, res) => {
      const { user, token } = await registerUser(req.body);

      const link = `${env.CLIENT_URL}/verify?token=${token}`;

      await transporter.sendMail({
        to: user.email,
        subject: 'Verify your email',
        html: `<a href="${link}"> Verify your email</a>`
      });
      res.json({
             id: user.id,
             username: user.username,
             email: user.email
      }
      );
}


export const verify = async (req, res) => {
  const token = req.query.token;

  console.log("TOKEN:", token);

  const user = await UserModel.verify(token);

  console.log("USER:", user);

  if (!user) {
    return res.status(400).send("Invalid or expired token");
  }

  res.send("Email verified successfully you can login now.");
};



export const login = async (req, res) => {
      try{
      const { user, accessToken, refreshToken } = await loginUser(req.body);

      res.cookie('access_token', accessToken , {httpOnly: true, sameSite: "lax", secure: false});
      res.cookie('refresh_token', refreshToken, {httpOnly: true, sameSite: "lax", secure: false})
      res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            //token
      })
       } catch (err) {
                res.status(400).json({ error: err.message });
        }
}

//*  -------------  current_user--------------- //

export const current_user = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, avatar, latitude, longitude FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    let avatarUrl;

    if (env.NODE_ENV === "development") {
      // Localhost üçün tam URL düzəlt
      const serverUrl = env.SERVER_URL || "http://localhost:5000";
      avatarUrl = user.avatar ? `${serverUrl}${user.avatar}` : null;
    } else {
      // Production → Cloudinary URL artıq DB-də tam saxlanır
      avatarUrl = user.avatar;
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: avatarUrl,
      latitude: user.latitude,
      longitude: user.longitude
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};


//*  -------------  current_user--------------- //




//* --------------  Logout--------------//
  export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.json({ message: "Logged out" });
};
// *--------------  Logout--------------//




