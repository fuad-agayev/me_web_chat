// composables/useChat.ts
import { Socket } from "socket.io-client";
import { useApi } from "~/composables/refreshApi";

interface Reaction {
  id: number;
  messageId: number;
  //message_id?: number;
  userId: number;
 // user_id?: number;
  emoji: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  avatar?: string
  reactions?: Reaction[];
  delivered?: boolean;
  read?: boolean;
  edited?: boolean;
  deleted?: boolean;
  audio_url?: string;
  created_at?: string;
}

interface TypingUser {
  senderId: number;
}

interface UserOfflinePayload {
  userId: number;
  lastSeen?: string | null;
}

interface UserOnlinePayload {
  userId: number;
}

export const useChat = () => {
  const { $socket } = useNuxtApp();
  const socket = $socket as Socket;

  const { request } = useApi();

  // ======================
  // STATE
  // ======================
  const messages = useState<Message[]>("messages", () => []);
  const selectedUser = useState<number | null>("selectedUser", () => null);

  const onlineUsers = useState<number[]>("onlineUsers", () => []);
  const typingUsers = useState<number[]>("typingUsers", () => []);
  const userLastSeen = useState<Record<number, string | null>>(
    "userLastSeen",
    () => ({})
  );

  // ======================
  // FETCH MESSAGES
  // ======================
  const fetchMessages = async (userId: number) => {
    if (!selectedUser.value) return;

    const res = await request(`/api/messages/${selectedUser.value}`);
    messages.value = res as Message[];
  };

  
  // _________________  SEND MESSAGE  __________________||
  
 
const sendMessage = (content: string, receiverId: number, audio_url?: string) => {
    console.count("FRONTEND sendMessage");
  if (!selectedUser.value) return;
  // həm content, həm audio boşdursa göndərmə
  if (!content.trim() && !audio_url) return;

  socket.emit("sendMessage", {
    //receiver_id: selectedUser.value,
    receiver_id: receiverId,
    content,
    audio_url
  });
};



  // ======================
  // TYPING
  // ======================
  const startTyping = (receiverId: number) => {
    if (!selectedUser.value) return;

    socket.emit("typing", {
      receiver_id:selectedUser.value,
    });
  };

  const stopTyping = (receiverId: number) => {
    if (!selectedUser.value) return;

    socket.emit("stopTyping", {
      receiver_id: selectedUser.value,
    });
  };


  const addReaction = (messageId: number, emoji: string, receiverId: number) => {
  socket.emit("addPrivateReaction", { messageId, emoji, receiverId });
};

const removeReaction = (messageId: number, emoji: string, receiverId: number) => {
  socket.emit("removePrivateReaction", { messageId, emoji, receiverId });
};

  
  // ________________SOCKET LISTENERS_________________\\
  
  const initListeners = () => {
    // cleanup
    socket.off("connect");

    socket.off("messageSent");
    socket.off("newMessage");
    socket.off("messageRead");
    socket.off("messageDelivered");
    socket.off("messageEdited");
    socket.off("messageDeleted");

    socket.off("typing");
    socket.off("stopTyping");

    socket.off("onlineUsers");
    socket.off("userOnline");
    socket.off("userOffline");

    socket.off("privateReactionAdded");
    socket.off("privateReactionRemoved");

    // ======================
    // CONNECT / RECONNECT
    // ======================
    
     socket.on("connect", () => {
    socket.emit("getOnlineUsers");
     });

    // ======================
    // ONLINE USERS (MAIN SOURCE)
    // ======================
    // socket.on("onlineUsers", (users: number[]) => {
    //   onlineUsers.value = users;
    // });

    // // instant online event (optional but useful)
    // socket.on("userOnline", ({ userId }: UserOnlinePayload) => {
    //   if (!onlineUsers.value.includes(userId)) {
    //     onlineUsers.value.push(userId);
    //   }

    //   // online oldusa lastSeen sil
    //   userLastSeen.value[userId] = null;
    // });


socket.on("onlineUsers", (users: number[]) => {
  onlineUsers.value = [...users];
});

socket.on("userOnline", ({ userId }) => {
  if (!onlineUsers.value.includes(userId)) {
    onlineUsers.value.push(userId);
  }
  userLastSeen.value[userId] = null;
});



    // offline + last seen
    socket.on("userOffline", ({ userId, lastSeen }: UserOfflinePayload) => {
      onlineUsers.value = onlineUsers.value.filter(
        (id) => id !== userId
      );

      userLastSeen.value[userId] = lastSeen || null;
    });

    
    // _____________   MESSAGES  _________________//
  

  socket.on("messageSent", (msg: Message) => {
  if (msg.audio_url) {
    if (!messages.value.some(m => m.audio_url === msg.audio_url && m.sender_id === msg.sender_id)) {
      messages.value.push(msg);
    }
  } else {
    if (!messages.value.some(m => m.id === msg.id)) {
      messages.value.push(msg);
    }
  }
});

socket.on("newMessage", (msg: Message) => {
  if (msg.audio_url) {
    if (!messages.value.some(m => m.audio_url === msg.audio_url && m.sender_id === msg.sender_id)) {
      messages.value.push(msg);
    }
  } else {
    if (!messages.value.some(m => m.id === msg.id)) {
      messages.value.push(msg);
    }
  }

  if (Notification.permission === "granted") {
    new Notification("You Have message..!", {
      body: msg.content,
      icon: "/chat_app.png"
    });
  }
});

    socket.on("messageRead", ({ messageId }) => {
      const msg = messages.value.find((m) => m.id === messageId);
      if (msg) msg.read = true;
    });

    socket.on("messageDelivered", ({ messageId }) => {
      const msg = messages.value.find((m) => m.id === messageId);
      if (msg) msg.delivered = true;
    });

    socket.on("messageEdited", (updated: Message) => {
      const index = messages.value.findIndex(
        (m) => m.id === updated.id
      );

      if (index !== -1) {
        messages.value[index] = {
          ...messages.value[index],
          ...updated,
        };
      }
    });

    socket.on("messageDeleted", (deleted: Message) => {
      const msg = messages.value.find((m) => m.id === deleted.id);

      if (msg) {
        msg.deleted = true;
        msg.content = "";
      }
    });

    // ======================
    // TYPING
    // ======================
    socket.on("typing", ({ senderId }: TypingUser) => {
      if (!typingUsers.value.includes(senderId)) {
        typingUsers.value.push(senderId);
      }
    });

    socket.on("stopTyping", ({ senderId }: TypingUser) => {
      typingUsers.value = typingUsers.value.filter(
        (id) => id !== senderId
      );
    });



// --- REAKSİYON EKLEME ---

socket.on("privateReactionAdded", (reaction: any) => {
  const targetMsgId = Number(reaction.messageId || reaction.message_id);
  const reactorUserId = Number(reaction.userId || reaction.user_id);

  // Mevcut mesajlar dizisinin tamamen yeni bir referans kopyasını oluşturuyoruz (Reaktiviteyi zorlamak için)
  messages.value = messages.value.map(msg => {
    if (Number(msg.id) === targetMsgId) {
      const currentReactions = msg.reactions ? [...msg.reactions] : [];
      
      // Aynı kullanıcının bu mesajdaki eski reaksiyonunu filtrele
      const filtered = currentReactions.filter(
        (r: any) => !(Number(r.userId || r.user_id) === reactorUserId && r.emoji === reaction.emoji)
      );

      // Yeni reaksiyonu ekle
      filtered.push({
        userId: reactorUserId,
        user_id: reactorUserId,
        messageId: targetMsgId,
        message_id: targetMsgId,
        emoji: reaction.emoji
      } as any);

      return { ...msg, reactions: filtered };
    }
    return msg;
  });
});

// --- REAKSİYON SİLME ---

socket.on("privateReactionRemoved", (data: any) => {
  const targetMsgId = Number(data.messageId || data.message_id);
  const reactorUserId = Number(data.userId || data.user_id);
  const emoji = data.emoji;

  messages.value = messages.value.map(msg => {
    if (Number(msg.id) === targetMsgId) {
      const currentReactions = msg.reactions ? [...msg.reactions] : [];
      
      // Silinen emojiyi diziden ayıklıyoruz
      const filtered = currentReactions.filter(
        (r: any) => !(Number(r.userId || r.user_id) === reactorUserId && r.emoji === emoji)
      );

      return { ...msg, reactions: filtered };
    }
    return msg;
  });
});


  };
// ________________SOCKET LISTENERS_________________\\
  

// ________________   HELPERS       _________________\\
  const isUserOnline = (userId: number) => {
    return onlineUsers.value.includes(userId);
  };
  

  const isUserTyping = (userId: number) => {
    return typingUsers.value.includes(userId);
  };

  const getLastSeen = (userId: number) => {
    return userLastSeen.value[userId] || null;
  };
// ________________SOCKET LISTENERS_________________\\


  
  return {
    // state
    messages,
    selectedUser,
    onlineUsers,
    typingUsers,
    userLastSeen,

    // actions
    fetchMessages,
    sendMessage,
    startTyping,
    stopTyping,
    initListeners,
    addReaction,
    removeReaction, 

    // helpers
    isUserOnline,
    isUserTyping,
    getLastSeen,
  };
};
