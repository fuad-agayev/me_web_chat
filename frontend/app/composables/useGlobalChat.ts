import { Socket } from 'socket.io-client';
import { useApi } from '~/composables/refreshApi';
import { nextTick } from "vue";

export interface GlobalMessage {
  id: number;
  sender_id: number;
  content: string;
  edited?: boolean;
  deleted?: boolean;
  created_at: string;
  username: string;
  avatar?: string;
  audio_url?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface GlobalTypingPayload {
  userId: number;
  username: string;
}

export const useGlobalChat = () => {
  const { $socket } = useNuxtApp();
  const socket = $socket as Socket;
  const { request } = useApi();

  const messages = useState<GlobalMessage[]>("globalMessages", () => []);
  const globalUsersCount = useState<number>("globalUsersCount", () => 0);
  const typingUsers = useState<string[]>("globalTypingUsers", () => []);
  const globalOnlineUsers = useState<{id:number, username:string, avatar?:string}[]>("globalOnlineUsers", () => []);

  const fetchGlobalMessages = async (limit = 20, offset = 0) => {
    const res = await request(`/api/global/paginated?limit=${limit}&offset=${offset}`);
    return res as GlobalMessage[];
  };

  const fetchLastGlobalMessages = async () => {
    const res = await request('/api/global/last-messages');
    return res as { sender_id: number; last_message_time: string }[];
  };

  const joinGlobal = () => socket.emit("joinGlobal");
  const leaveGlobal = () => socket.emit("leaveGlobal");

  const sendGlobalMessage = (content: string, audio_url?:string) => {
    if (!content.trim()) return;
    socket.emit("sendGlobalMessage", { content, audio_url });
  };

  const editGlobalMessage = (messageId: number, content: string) => {
    socket.emit("editGlobalMessage", { messageId, content });
  };

  const deleteGlobalMessage = (messageId: number) => {
    socket.emit("deleteGlobalMessage", { messageId });
  };

  const startGlobalTyping = (userId: number, username: string) => {
    socket.emit("globalTyping", { userId, username });
  };

  const stopGlobalTyping = (userId: number, username: string) => {
    socket.emit("globalStopTyping", { userId, username });
  };

  const fetchGlobalOnlineUsers = async () => {
    const res = await request('/api/global/online-users');
    globalOnlineUsers.value = res as {id:number, username:string, avatar?:string}[];
  };

  const initGlobalListeners = (messagesContainer?: Ref<HTMLDivElement|null>, user?: User) => {
    cleanupGlobalListeners(); // əvvəlcə təmizlə

    socket.on("newGlobalMessage", (msg: GlobalMessage) => {
      if (!messages.value.some(m => m.id === msg.id)) {
        messages.value.push(msg);
        nextTick(() => {
          const container = messagesContainer?.value;
          if (container) {
            if (msg.sender_id === user?.id) {
              container.scrollTop = container.scrollHeight;
            } else {
              const threshold = 100;
              const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
              if (nearBottom) {
                container.scrollTop = container.scrollHeight;
              }
            }
          }
        });
      }
    });

    socket.on("globalMessageEdited", (updated: GlobalMessage) => {
      const index = messages.value.findIndex((m) => m.id === updated.id);
      if (index !== -1) {
        messages.value[index] = { ...messages.value[index], ...updated };
      }
    });

    socket.on("globalMessageDeleted", (deleted: GlobalMessage) => {
      const msg = messages.value.find((m) => m.id === deleted.id);
      if (msg) {
        msg.deleted = true;
        msg.content = "";
      }
    });

    socket.on("globalUsersCount", (count: number) => {
      globalUsersCount.value = count;
    });

    socket.on("globalTyping", ({ userId, username }: GlobalTypingPayload) => {
      if (!typingUsers.value.includes(username)) {
        typingUsers.value.push(username);
      }
    });

    socket.on("globalStopTyping", ({ userId, username }: GlobalTypingPayload) => {
      typingUsers.value = typingUsers.value.filter((u) => u !== username);
    });

    socket.on("globalOnlineUsers", (users) => {
      globalOnlineUsers.value = users;
    });
  };

  const cleanupGlobalListeners = () => {
    socket.off("newGlobalMessage");
    socket.off("globalMessageEdited");
    socket.off("globalMessageDeleted");
    socket.off("globalUsersCount");
    socket.off("globalTyping");
    socket.off("globalStopTyping");
    socket.off("globalOnlineUsers");
  };

  const isUserTyping = (username: string) => typingUsers.value.includes(username);

  return {
    messages,
    globalUsersCount,
    globalOnlineUsers,
    typingUsers,
    fetchGlobalMessages,
    fetchLastGlobalMessages,
    fetchGlobalOnlineUsers,
    joinGlobal,
    leaveGlobal,
    sendGlobalMessage,
    editGlobalMessage,
    deleteGlobalMessage,
    startGlobalTyping,
    stopGlobalTyping,
    initGlobalListeners,
    cleanupGlobalListeners,
    isUserTyping
  };
};
