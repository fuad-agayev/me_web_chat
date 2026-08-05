
import { Server } from "socket.io";
import cookie from "cookie";
import { verifyAccessToken } from "../utils/jwt.js";
import { env } from '../config/env.js';
import { UserModel } from '../models/user.model.js';
import { formatAvatarUrl } from '../utils/avatar.js';
import { formatAudioUrl } from '../utils/audio.js';

import {
  sendMessageService,
  markMessageAsRead,
  markMessageAsDelivered,
  editMessageService,
  deleteMessageService,
} from "../services/message.service.js";

import { createGlobalMessage, editGlobalMessage, deleteGlobalMessage, fetchGlobalOnlineUsers } from '../services/global.service.js';


//import { reactToMessage, removeReactionFromMessage } from '../services/reaction.service.js'
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

           

socket.on("sendGlobalMessage", async ({ content, audio_url }) => {
  const formattedUrl = formatAudioUrl(audio_url);
  const msg = await createGlobalMessage(userId, content, formattedUrl);
  const user = await UserModel.findById(userId);

  io.emit("newGlobalMessage", {
    id: msg.id,
    sender_id: user.id,
    username: user.username,
    avatar: formatAvatarUrl(user.avatar), // user.avatar → avatarPath
    audio_url: formattedUrl, // formatAudioUrl(msg.audio_url)
    content: msg.content,
    created_at: msg.created_at
  });
});


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




// _________________________    REACTIONS ______________________ \\

socket.on("addPrivateReaction", async ({ messageId, emoji, receiverId }) => {
  try {
    const cleanMessageId = parseInt(messageId, 10);
    const cleanUserId = parseInt(userId, 10); // Sokete bağlanan aktif kullanıcının ID'si (Soket oturumundan alınmalı)

    // Backend modelini çağırıp veritabanına yazıyoruz
    const reaction = await addReaction(cleanMessageId, cleanUserId, emoji);

    const payload = {
      id: reaction?.id,
      messageId: cleanMessageId,
      message_id: cleanMessageId,
      userId: cleanUserId,
      user_id: cleanUserId,
      emoji: emoji
    };

    // Hem gönderene hem alıcıya odaları üzerinden anında fırlatıyoruz
    io.to(`user_${cleanUserId}`).emit("privateReactionAdded", payload);
    io.to(`user_${receiverId}`).emit("privateReactionAdded", payload);
  } catch (error) {
    console.error("Reaksiyon eklenirken soket hatası:", error);
  }
});

// --- REAKSİYON SİLME SOKETİ ---
socket.on("removePrivateReaction", async ({ messageId, emoji, receiverId }) => {
  try {
    const cleanMessageId = parseInt(messageId, 10);
    const cleanUserId = parseInt(userId, 10);

    // Backend modelindeki removeReaction fonksiyonunu tetikliyoruz
    await removeReaction(cleanMessageId, cleanUserId, emoji);

    const payload = {
      messageId: cleanMessageId,
      message_id: cleanMessageId,
      userId: cleanUserId,
      user_id: cleanUserId,
      emoji: emoji
    };

    // İki tarafa da silindi bilgisini anında gönderiyoruz
    io.to(`user_${cleanUserId}`).emit("privateReactionRemoved", payload);
    io.to(`user_${receiverId}`).emit("privateReactionRemoved", payload);
  } catch (error) {
    console.error("Reaksiyon silinirken soket hatası:", error);
  }
});

// _________________________    REACTIONS ______________________ ||


   
    // ________________  MESSAGE  ______________// 
  
    socket.on("sendMessage", async ({ receiver_id, content, audio_url }) => {
         console.log("SEND MESSAGE EVENT", {
        receiver_id,
        content,
        audio_url
    });
      const msg = await sendMessageService(userId, receiver_id, content, audio_url);

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

//?  BU islemler  ILAVE ederdik refresh Bitdike chat sohbet bitmiyor kulalnicilar shbet edebilir ancak baska safyafa gecit yapincay kadar 
//?  v ebundna sonr a  artik lOGIN sayfasi gosterir sayfaya gitdikde artik chat baglanir cja=hat qalirlarsa devan eder duumu our NORMALdir 
// ?  guvenlik acisi deyildir
//?   V e  bu silmei hangi refresh bitdikde chat bitsin gibi yamak istedidke vey gureki kontrol ederke toekn verilmeis ilede yapabiliriz  kodlarini asagifdakilat 
//? ilave edebiliriz ANcak gerek yokUNUTMAAAAAAAAAAAAAA bu mantiki!!!!!!
//*BU KISIM EN BASD KIDIR MIDDLEWARE -dir
// io.use((socket, next) => {
//   const cookies = cookie.parse(socket.handshake.headers.cookie || "");
//   const token = cookies.access_token;

//   if (!token) return next(new Error("Unauthorized"));

//   socket.user = verifyAccessToken(token);
//   next();
// });

//*  Bu da ayric atek bir socket.on -a yapmakla yontmei ayricalikli EVENtlere yapmak yontemi ----OZEL olarak ---
//? 🔹 2. Her mesajda veya belirli aralıklarla token kontrolü
//? Burada ek yapman lazım. Örneğin sendMessage event’inde:
//?Burada hər mesaj göndəriləndə token yenidən yoxlanılır.
//?Bu təhlükəsizlik baxımından güclüdür, amma performans baxımından ağırdır.
// js
// socket.on("sendMessage", async ({ receiver_id, content }) => {
//   try {
//     // Tokeni her mesajda kontrol et
//     verifyAccessToken(cookie.parse(socket.handshake.headers.cookie || "").access_token);

//     const msg = await sendMessageService(userId, receiver_id, content);
//     io.to(`user_${userId}`).emit("messageSent", msg);
//     io.to(`user_${receiver_id}`).emit("newMessage", msg);
//   } catch (err) {
//     socket.emit("error", "Token expired, please login again");
//     socket.disconnect(); // Token geçersizse bağlantıyı kes
//   }
// });
//? 🔹 3. Alternatif: Periyodik kontrol Periyodik yoxlama → daha yüngül, amma kiçik gecikmə riski var.

//* Her mesajda kontrol yapmak yerine, belirli aralıklarla (örneğin her 1 dakikada bir) token doğrulaması yapabilirsin:

//? setInterval(() => {
//?   try {
//?     verifyAccessToken(cookie.parse(socket.handshake.headers.cookie || "").access_token);
//?   } catch (err) {
//?     socket.emit("error", "Session expired");
//?     socket.disconnect();
//?   }
//? }, 60000); // her 60 saniyede bir kontrol
//!Bu performans baxımından yüngüldür, amma təhlükəsizlikdə kiçik boşluq yaradır (token vaxtı bitibsə, 1 dəqiqəlik gecikmə ola bilər).