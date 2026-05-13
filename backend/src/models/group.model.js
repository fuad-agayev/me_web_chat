import { pool } from '../config/db.js';


export const groupModel = {
  createGroup: async (name, userId) => {
    const r = await pool.query(
      `INSERT INTO groups (name, created_by)
                        VALUES ($1, $2)
                        RETURNING *`
                        , [name, userId]
    );
    return r.rows[0];
  },

  addMember: async (groupId, userId) => {
          await pool.query(
      `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)
                        ON CONFLICT DO NOTHING`,
      [groupId, userId]
    )

  },

  getUsersGroups: async (userId) => {
     const r = await pool.query(
      `SELECT g.* FROM groups g
        JOIN group_members gm ON gm.group_id = g.id
        WHERE gm.user_id = $1`,
        [userId]
     )
     return r.rows;
  },

  isMember: async (groupId, userId) => {
    const r = await pool.query(
      `
      SELECT 1 FROM group_members
      WHERE group_id = $1 AND user_id = $2
      `,
      [groupId, userId]
    )
    return r.rows.length > 0;
  },

  createMessage: async (groupId, senderId, content) => {
     const r = await pool.query(
      `
      INSERT INTO group_messages (group_id, sender_id, content)
      VALUES ($1, $2, $3)
       RETURNING *
      `,
      [groupId, senderId, content]
     )
     return r.rows[0];
  },

  getMessages: async (groupId) => {
    const r = await pool.query(
      `
          SELECT gm.*, u.username FROM group_messages gm
          JOIN users u ON u.id = gm.sender_id
          WHERE gm.group_id = $1
          ORDER BY gm.created_at ASC
      `,
      [groupId]
    )
     return r.rows;
  },

  editMessage: async (messageId, userId, content) => {

  const r = await pool.query(
    `
    UPDATE group_messages
    SET content = $1,
        edited = TRUE
    WHERE id = $2 AND sender_id = $3
    RETURNING *
    `,
    [content, messageId, userId]
  );

  return r.rows[0];
},

deleteMessage: async (messageId, userId) => {

  const r = await pool.query(
    `
    UPDATE group_messages
    SET deleted = TRUE,
        content = ''
    WHERE id = $1 AND sender_id = $2
    RETURNING *
    `,
    [messageId, userId]
  );

  return r.rows[0];
}
}