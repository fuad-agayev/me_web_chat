import { registerUser, loginUser } from '../services/auth.service.js';
import { transporter } from '../config/mail.js';
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


export const current_user = (req, res) => {
    res.json(req.user)
}




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




