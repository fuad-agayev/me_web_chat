import { pool } from '../config/db.js';

export const globalMessageModel = {

  create: async (senderId, content) => {
    const r = await pool.query(
      `
      INSERT INTO global_messages (sender_id, content)
      VALUES ($1, $2)
      RETURNING *
      `,
      [senderId, content]
    );

    return r.rows[0];
  },

   getAll: async () => {
      const r = await pool.query(
        ` 
        SELECT global_messages.*, users.username
        FROM global_messages
        JOIN users ON users.id = global_messages.sender_id
        ORDER BY global_messages.created_at ASC
        `
      );
      return r.rows;
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
   }
  

}