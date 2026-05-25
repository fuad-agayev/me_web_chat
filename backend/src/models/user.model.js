import { pool } from '../config/db.js';

export const UserModel = {
  findByEmail: async (email) => {
     const r = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
     return r.rows[0];
  },
  create: async (username, email, password, token) => {
    const r = await pool.query(
    "INSERT INTO users (username,email,password,verification_token) VALUES ($1,$2,$3,$4) RETURNING *",
    [username, email, password, token]
  );
  return r.rows[0]
},
  verify: async (token) => {
    const r = await pool.query("UPDATE users SET is_verified = true WHERE verification_token = $1 RETURNING *", [token]
    )
     return r.rows[0];
  },

   // 🕒 Son görülmə vaxtı (offline olanda)
  updateLastSeen: async (userId) => {
    const r = await pool.query(
      `
      UPDATE users
      SET last_seen = NOW()
      WHERE id = $1
      RETURNING last_seen
      `,
      [userId]
    );

    return r.rows[0];
  },

  // Avatar 

 updateAvatarModel: async (userId, avatar) => {
    return pool.query(
      `
      UPDATE users 
      SET avatar = $1
      WHERE id = $2`,
      [avatar, userId]
    );
  };






  //? 👤 ID ilə user tapmaq (profile / socket / UI üçün faydalı) Ben Email ile yapdim bunu yerine findByEmail:   ile
  // findById: async (userId) => {
  //   const r = await pool.query(
  //     `
  //     SELECT
  //       id,
  //       username,
  //       email,
  //       last_seen,
  //       created_at
  //     FROM users
  //     WHERE id = $1
  //     `,
  //     [userId]
  //   );

  //   return r.rows[0];
  // }
}