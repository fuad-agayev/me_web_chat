
import { Server } from "socket.io";
import cookie from "cookie";
import { verifyAccessToken } from "../utils/jwt.js";
import { env } from '../config/env.js';
import { UserModel } from '../models/user.model.js';
import { formatAvatarUrl } from '../utils/avatar.js';

import {
  sendMessageService,
  markMessageAsRead,
  markMessageAsDelivered,
  editMessageService,
  deleteMessageService,
} from "../services/message.service.js";

import { createGlobalMessage, editGlobalMessage, deleteGlobalMessage, fetchGlobalOnlineUsers } from '../services/global.service.js';


import { reactToMessage } from '../services/reaction.service.js'
import {  addReaction, removeReaction } from '../models/reaction.model.js'



import { updateLastSeen } from "../services/user.service.js";


const onlineUsers = new Set();

//Global Chat active zUsers
export const globalUsers = new Set();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  // ======================
  // AUTH
  // ======================



  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.access_token;

      if (!token) return next(new Error("Unauthorized"));

      socket.user = verifyAccessToken(token);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });


 

  // ======================
  // CONNECTION
  // ======================
  io.on("connection", (socket) => {
    const userId = socket.user.id;

    socket.join(`user_${userId}`);

    // add online user
    onlineUsers.add(userId);

    // send full list to everyone
    io.emit("onlineUsers", Array.from(onlineUsers));


    // optional instant event
io.emit("userOnline", { userId });

// manual resync
socket.on("getOnlineUsers", () => {
  socket.emit("onlineUsers", Array.from(onlineUsers));
});


//      /------------global chat events ------------------\
        

          socket.on("joinGlobal", async () => {
  globalUsers.add(userId);

  io.emit("globalUsersCount", globalUsers.size);
  const onlineUsers = await fetchGlobalOnlineUsers();
  io.emit("globalOnlineUsers", onlineUsers);
});


        
  socket.on("leaveGlobal", async () => {
          globalUsers.delete(userId);

             io.emit("globalUsersCount", globalUsers.size);
             const onlineUsers = await fetchGlobalOnlineUsers();
               io.emit("globalOnlineUsers", onlineUsers);
           });

           

socket.on("sendGlobalMessage", async ({ content }) => {
  const msg = await createGlobalMessage(userId, content);
  const user = await UserModel.findById(userId);

  io.emit("newGlobalMessage", {
    id: msg.id,
    sender_id: user.id,
    username: user.username,
    avatar: formatAvatarUrl(user.avatar), // user.avatar → avatarPath
    content: msg.content,
    created_at: msg.created_at
  });
});


        
// socket.on("sendGlobalMessage", async ({ content }) => {
//   const msg = await createGlobalMessage(userId, content);
//   const user = await UserModel.findById(userId);

//   let avatarUrl;
//   if (env.NODE_ENV === "development") {
//     const serverUrl = env.SERVER_URL || "http://localhost:5000";
//     avatarUrl = user.avatar ? `${serverUrl}${user.avatar}` : null;
//   } else {
//     avatarUrl = user.avatar;
//   }

//   io.emit("newGlobalMessage", {
//     id: msg.id,
//     sender_id: user.id,
//     username: user.username,
//     avatar: avatarUrl,
//     content: msg.content,
//     created_at: msg.created_at
//   });
// });




         socket.on("editGlobalMessage", async ({messageId, content}) => {
            const updated = await editGlobalMessage(messageId, userId, content)

            io.emit("globalMessageEdited", updated)
         })

          socket.on("deleteGlobalMessage", async ({messageId}) => {
            const deleted = await deleteGlobalMessage(messageId, userId);

            io.emit("globalMessageDeleted", deleted);
          })
       
          socket.on("globalTyping", ({userId, username}) => {
            socket.broadcast.emit("globalTyping", {
              userId, username
            })
          })

          socket.on("globalStopTyping", async ({userId, username}) => {
             socket.broadcast.emit("globalStopTyping", {
              userId, username
             })
          })

// ____________  global chat events _________________ //




//   ___________________  Reactions  __________________   //


socket.on("addPrivateReaction", async ({ messageId, emoji, receiverId }) => {
  const reaction = await addReaction(messageId, userId, emoji);

  io.to(`user_${userId}`).emit("privateReactionAdded", reaction);
  io.to(`user_${receiverId}`).emit("privateReactionAdded", reaction);
});



socket.on(
  "removePrivateReaction",
  async ({ messageId, emoji, receiverId }) => {

    await removeReaction(
      messageId,
      userId,
      emoji
    );

    io.to(`user_${userId}`).emit(
      "privateReactionRemoved",
      {
        messageId,
        userId,
        emoji
      }
    );

    io.to(`user_${receiverId}`).emit(
      "privateReactionRemoved",
      {
        messageId,
        userId,
        emoji
      }
    );
  }
);

//   ___________________  Reactions  __________________//

    // ======================
    // MESSAGE
    // ======================
    socket.on("sendMessage", async ({ receiver_id, content }) => {
      const msg = await sendMessageService(userId, receiver_id, content);

      io.to(`user_${userId}`).emit("messageSent", msg);
      io.to(`user_${receiver_id}`).emit("newMessage", msg);
    });

    // READ
    socket.on("messageRead", async ({ messageId, senderId }) => {
      await markMessageAsRead(messageId);

      io.to(`user_${senderId}`).emit("messageRead", {
        messageId,
      });
    });

    // DELIVERED
    socket.on("messageDelivered", async ({ messageId, senderId }) => {
      await markMessageAsDelivered(messageId);

      io.to(`user_${senderId}`).emit("messageDelivered", {
        messageId,
      });
    });

    // EDIT
    socket.on("editMessage", async ({ messageId, content, receiver_id }) => {
      const updated = await editMessageService(messageId, userId, content);

      io.to(`user_${userId}`).emit("messageEdited", updated);
      io.to(`user_${receiver_id}`).emit("messageEdited", updated);
    });

    // DELETE
    socket.on("deleteMessage", async ({ messageId, receiver_id }) => {
      const deleted = await deleteMessageService(messageId, userId);

      io.to(`user_${userId}`).emit("messageDeleted", deleted);
      io.to(`user_${receiver_id}`).emit("messageDeleted", deleted);
    });

    // TYPING
    socket.on("typing", ({ receiver_id }) => {
      io.to(`user_${receiver_id}`).emit("typing", {
        senderId: userId,
      });
    });

    socket.on("stopTyping", ({ receiver_id }) => {
      io.to(`user_${receiver_id}`).emit("stopTyping", {
        senderId: userId,
      });
    });

    
    // disconnect
// disconnect
socket.on("disconnect", async () => {
  setTimeout(async () => {
    const r = await updateLastSeen(userId);

    onlineUsers.delete(userId);

    // full refresh
    io.emit("onlineUsers", Array.from(onlineUsers));

    // last seen
    if (r) {
      io.emit("userOffline", {
        userId,
        lastSeen: r.last_seen,
      });
    } else {
      console.warn("updateLastSeen returned undefined for userId:", userId);
    }
  }, 2000);
});

});

}