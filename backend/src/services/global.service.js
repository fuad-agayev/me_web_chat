
import { globalMessageModel } from '../models/global.model.js';
import { pool } from '../config/db.js';

export const createGlobalMessage = async (senderId, content) => {
  const created = await globalMessageModel.create(senderId, content);

  const r = await pool.query(
    `
    SELECT gm.*, u.username
    FROM global_messages gm
    JOIN users u ON u.id = gm.sender_id
    WHERE gm.id = $1
    `,
    [created.id]
  );

  return r.rows[0];
};



export const getAllGlobalMessages = async () => {
      return await globalMessageModel.getAll();
};

export const editGlobalMessage = async (messageId, userId, content) => {
      return await globalMessageModel.edit(messageId, userId, content);
};

export const deleteGlobalMessage = async (messageId, userId) => {
      return await globalMessageModel.delete(messageId, userId);

}



