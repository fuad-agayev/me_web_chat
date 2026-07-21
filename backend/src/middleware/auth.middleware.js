
import { verifyAccessToken} from '../utils/jwt.js';

export const auth = (req, res, next) => {
       const token = req.cookies.access_token;

       if(!token) {
           return res.status(401).json({error: "Unauthorized"})
       }
        try{
            //ACCESs token-i alir ve decode eder  ve kullanci isteyiden kullanici acces toekni ile berbaerlesdiri 
            const decoded = verifyAccessToken(token);
            req.user = decoded;
            next();
        } catch{
              return res.status(401).json({error: "Invalid or expired token"})
        }
};