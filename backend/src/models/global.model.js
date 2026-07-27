import { pool } from '../config/db.js';
import { formatAvatarUrl } from '../utils/avatar.js';

export const globalMessageModel = {

  create: async (senderId, content, audio_url) => {
    const r = await pool.query(
      `
      INSERT INTO global_messages (sender_id, content, audio_url)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [senderId, content, audio_url]
    );

    return r.rows[0];
  },

  //  getAll: async () => {
  //     const r = await pool.query(
  //       ` 
  //       SELECT global_messages.*, users.username
  //       FROM global_messages
  //       JOIN users ON users.id = global_messages.sender_id
  //       ORDER BY global_messages.created_at ASC
  //       `
  //     );
  //     return r.rows;
  //  },  
  
  // * Already use getPaginated for pagination, so no need to get all messages at once.


   getPaginated: async (limit = 20, offset = 0) => {
  const r = await pool.query(
    `
    SELECT gm.*, u.username, u.avatar
    FROM global_messages gm
    JOIN users u ON u.id = gm.sender_id
    ORDER BY gm.created_at DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return r.rows.map(row => ({
    ...row,
    avatar: formatAvatarUrl(row.avatar)
  }));
},


   edit: async (messageId, userId, content) => {
    const r = await pool.query(
      `
      UPDATE global_messages
      SET content = $1,
        edited = TRUE,
        edited_at = NOW()
      WHERE id = $2 AND sender_id = $3
      RETURNING *
      `,
      [content, messageId, userId]
    );
    return r.rows[0];
   },

   delete: async (messageId, userId) => {
    const r = await pool.query(
      `
      UPDATE global_messages
        SET deleted = TRUE,
           content = '',
           deleted_at = NOW()
        WHERE id = $1 AND sender_id = $2
        RETURNING *
      `,
      [messageId, userId]
    );
    return r.rows[0];
   },
  
getLastMessageTimes: async () => {
  const r = await pool.query(`
    SELECT sender_id, MAX(created_at) as last_message_time
    FROM global_messages
    GROUP BY sender_id
  `);
  return r.rows;
}
}