import { pool } from '../config/db.js';

export const MessageModel = {
  create: async (sender, receiver, content, audio_url) => {
     console.log("INSERT MESSAGE", {
    sender,
    receiver,
    content,
    audio_url
  });

    const r = await pool.query("INSERT INTO messages (sender_id, receiver_id, content, audio_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [sender, receiver, content, audio_url])
    return r.rows[0];
  },

  getConversation: async (user1, user2) => {
      const r = await pool.query(
        `
    SELECT m.*, u.username, u.avatar
    FROM messages m
    JOIN users u ON u.id = m.sender_id
    WHERE (m.sender_id=$1 AND m.receiver_id=$2)
       OR (m.sender_id=$2 AND m.receiver_id=$1)
    ORDER BY m.created_at ASC
        `,
      [user1, user2])
    return r.rows;
  },

  markedAsRead: async (messageId) => {
    const r = await pool.query("UPDATE messages SET read = true, read_at = NOW() WHERE id = $1 RETURNING *", 
      [Number[messageId]]
    )
      return r.rows[0];
  },

  markedAsDelivered: async (messageId) => {
    const r = await pool.query("UPDATE messages SET delivered = true, delivered_at = NOW() WHERE id = $1 RETURNING *",
       [messageId])
       return r.rows[0];
  },

  editedMessageService: async (messageId, userId, content)=> {
    const r = await pool.query(`UPDATE messages 
      SET content = $1,
        edited = true,
        edited_at = NOW()
      WHERE id = $2 AND sender_id = $3
      RETURNING *`,
    [content,messageId, userId])
    return r.rows[0];
  },

  deletedMessageService: async (messageId, userId) => {
    const r = await pool.query(`
      UPDATE messages 
         SET content = true,
         deleted_at = NOW() 
      WHERE id = $1 AND sender_id = $2 
      RETURNING *`,
      [messageId, userId])
      return r.rows[0];
  }

}