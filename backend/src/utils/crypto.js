import crypto from 'crypto';

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
}
/*
? const otp = Math.floor(100000 + Math.random() * 900000); // 6 haneli
? Bu yöntem hızlıdır ama tahmin edilebilir olabilir.

? crypto.randomInt (Node.js 14+) → güvenli OTP üretmek için daha iyi:

? js
? import crypto from "crypto";
? const otp = crypto.randomInt(100000, 999999); // 6 haneli güvenli OTP
? crypto.randomBytes → genelde token üretmek için kullanılır ama OTP için de kullanılabilir:

? js
? import crypto from "crypto";
? const otp = parseInt(crypto.randomBytes(3).toString("hex"), 16) % 1000000;
? Bu da 6 haneli OTP üretir.
*/