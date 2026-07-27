import { env } from '../config/env.js';
import { globalMessageModel } from '../models/global.model.js';
import { pool } from '../config/db.js';
import { UserModel } from '../models/user.model.js';
import { globalUsers } from '../sockets/socket.js';
import { formatAvatarUrl } from '../utils/avatar.js';


export const createGlobalMessage = async (senderId, content, audio_url) => {
  const created = await globalMessageModel.create(senderId, content, audio_url);

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

export const getPaginatedGlobalMessages = async (limit = 20, offset = 0) => {
  return await globalMessageModel.getPaginated(limit, offset);
};


export const editGlobalMessage = async (messageId, userId, content) => {
      return await globalMessageModel.edit(messageId, userId, content);
};

export const deleteGlobalMessage = async (messageId, userId) => {
      return await globalMessageModel.delete(messageId, userId);

}

export const getLastGlobalMessageTimes = async () => {
  return await globalMessageModel.getLastMessageTimes();
};



// export const fetchGlobalOnlineUsers = async () => {
//   const onlineUserIds = Array.from(globalUsers);
//   const onlineUsers = await Promise.all(
//     onlineUserIds.map(async (userId) => {
//       const user = await UserModel.findById(userId);
//       if (!user) return null;

//       let avatarUrl;
//       if (env.NODE_ENV === "development") {
//         const serverUrl = env.SERVER_URL || "http://localhost:5000";
//         avatarUrl = user.avatar ? `${serverUrl}${user.avatar}` : null;
//       } else {
//         avatarUrl = user.avatar;
//       }

//       return {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         avatar: avatarUrl
//       };
//     })
//   );
//   return onlineUsers.filter(Boolean);
// };




export const fetchGlobalOnlineUsers = async () => {
  const onlineUserIds = Array.from(globalUsers);
  const onlineUsers = await Promise.all(
    onlineUserIds.map(async (userId) => {
      const user = await UserModel.findById(userId);
      if (!user) return null;

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: formatAvatarUrl(user.avatar) // user.avatar → avatarPath
      };
    })
  );
  return onlineUsers.filter(Boolean);
};



