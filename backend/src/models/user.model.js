import { pool } from '../config/db.js';

export const UserModel = {
  findByEmail: async (email) => {
     const r = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
     return r.rows[0];
  },
  create: async (username, email, password, token, latitude, longitude) => {
  const r = await pool.query(
    "INSERT INTO users (username, email, password, verification_token, latitude, longitude) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [username, email, password, token, latitude, longitude]
  );
  return r.rows[0];
},

  verify: async (token) => {
    const r = await pool.query("UPDATE users SET is_verified = true WHERE verification_token = $1 RETURNING *", [token]
    )
     return r.rows[0];
  },

   //? 🕒 Son görülmə vaxtı (offline olanda)
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
  },


  updateLocationModel: async (userId, latitude, longitude) => {
  const r = await pool.query(
    `
    UPDATE users
    SET
      latitude = $1,
      longitude = $2
    WHERE id = $3
    RETURNING latitude, longitude
    `,
    [latitude, longitude, userId]
  );

  return r.rows[0];
},


updatePassword: async (userId, password) => {
   await pool.query(
    `
    UPDATE users SET password=$1 WHERE id=$2
    `,
    [password, userId]
   );
},

findPasswordById: async (userId) => {
   const r = await pool.query(
    `
    SELECT password FROM users WHERE id=$1
    `,
    [userId]
   )
   return r.rows[0];
},


  //? 👤 ID ilə user tapmaq (profile / socket / UI üçün faydalı) Ben Email ile yapdim bunu yerine findByEmail:   ile
 
findById: async (userId) => {
  const r = await pool.query(
    `
    SELECT
      id,
      username,
      email,
      avatar,
      last_seen,
      created_at, 
      latitude,
      longitude
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  return r.rows[0];
}

}