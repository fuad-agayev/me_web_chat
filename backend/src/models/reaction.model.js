import { pool } from '../config/db.js';

export const addReaction = async (messageId, userId, emoji) => {
  const r = await pool.query(
    `
       INSERT INTO message_reactions (message_id, user_id, emoji)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING *
    `,
    [messageId, userId, emoji]
  )
  return r.rows[0];
};

export const removeReaction = async (messageId, userId, emoji) => {
  const r = await pool.query(
    `
       DELETE FROM message_reactions 
       WHERE message_id = $1 AND user_id = $2 AND emoji = $3
       RETURNING *
    `,
    [messageId, userId, emoji]

  )
    return r.rows[0];
}


export const getReactions = async (messageId) => {

  const r = await pool.query(
    `
    SELECT emoji, COUNT(*) as count
    FROM message_reactions
    WHERE message_id = $1
    GROUP BY emoji
    `,
    [messageId]
  );

  return r.rows;
};

