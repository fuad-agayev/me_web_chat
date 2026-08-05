import { getDemoUser } from '../services/demo.service.js';
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

export const demoLogin = async (req, res) => {
   const user = await getDemoUser();

   if(!user){
        return res.status(404).json({
          message: 'Demo user not found'
        })
   }

   const accessToken = signAccessToken({id: user.id});
   const refreshToken = signRefreshToken({id: user.id});


   // access cookie
  res.cookie(
    'access_token',
    accessToken,
    {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 20
    }
  );

  // refresh cookie
  res.cookie(
    'refresh_token',
    refreshToken,
    {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  );

  res.json({
    user
  });
}