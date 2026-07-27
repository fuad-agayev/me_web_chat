import { registerUser, loginUser, forgotPasswordService, resetPasswordService } from '../services/auth.service.js';
import { transporter } from '../config/mail.js';
import { pool } from '../config/db.js';
import { formatAvatarUrl } from "../utils/avatar.js";
import { UserModel } from '../models/user.model.js';
import { env } from "../config/env.js"

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


//* ------------- current_user ------------- //

export const current_user = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        avatar,
        google_id,
        latitude,
        longitude
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = result.rows[0];

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: formatAvatarUrl(user.avatar),
      google_id: user.google_id,
      latitude: user.latitude,
      longitude: user.longitude
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Error fetching profile"
    });
  }
};

//* ------------- current_user ------------- //



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




export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordService(token, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



export const googleCallback = (req, res) => {
  console.log("____________ GOOGLE CALLBACK ___________");

  const { user, jwtAccess, jwtRefresh } = req.user;
  console.log("User:", user.id);

  res.cookie("access_token", jwtAccess, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
 
});

res.cookie("refresh_token", jwtRefresh, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
});

  return res.redirect(`${env.CLIENT_URL}/success`);

};


