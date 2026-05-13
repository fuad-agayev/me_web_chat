// composables/useChat.ts
import { Socket } from "socket.io-client";
import { useApi } from "~/composables/refreshApi";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;

  delivered?: boolean;
  read?: boolean;
  edited?: boolean;
  deleted?: boolean;

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
  const fetchMessages = async () => {
    if (!selectedUser.value) return;

    const res = await request(`/api/messages/${selectedUser.value}`);
    messages.value = res as Message[];
  };

  // ======================
  // SEND MESSAGE
  // ======================
  const sendMessage = (content: string) => {
    if (!selectedUser.value || !content.trim()) return;

    socket.emit("sendMessage", {
      receiver_id: selectedUser.value,
      content,
    });
  };

  // ======================
  // TYPING
  // ======================
  const startTyping = () => {
    if (!selectedUser.value) return;

    socket.emit("typing", {
      receiver_id: selectedUser.value,
    });
  };

  const stopTyping = () => {
    if (!selectedUser.value) return;

    socket.emit("stopTyping", {
      receiver_id: selectedUser.value,
    });
  };

  // ======================
  // SOCKET LISTENERS
  // ======================
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

    // ======================
    // CONNECT / RECONNECT
    // ======================
    socket.on("connect", () => {
      socket.emit("getOnlineUsers");
    });

    // ======================
    // ONLINE USERS (MAIN SOURCE)
    // ======================
    socket.on("onlineUsers", (users: number[]) => {
      onlineUsers.value = users;
    });

    // instant online event (optional but useful)
    socket.on("userOnline", ({ userId }: UserOnlinePayload) => {
      if (!onlineUsers.value.includes(userId)) {
        onlineUsers.value.push(userId);
      }

      // online oldusa lastSeen sil
      userLastSeen.value[userId] = null;
    });

    // offline + last seen
    socket.on("userOffline", ({ userId, lastSeen }: UserOfflinePayload) => {
      onlineUsers.value = onlineUsers.value.filter(
        (id) => id !== userId
      );

      userLastSeen.value[userId] = lastSeen || null;
    });

    // ======================
    // MESSAGES
    // ======================
    socket.on("messageSent", (msg: Message) => {
      if (!messages.value.some((m) => m.id === msg.id)) {
        messages.value.push(msg);
      }
    });

    socket.on("newMessage", (msg: Message) => {
      if (!messages.value.some((m) => m.id === msg.id)) {
        messages.value.push(msg);
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
  };

  // ======================
  // HELPERS
  // ======================
  const isUserOnline = (userId: number) => {
    return onlineUsers.value.includes(userId);
  };

  const isUserTyping = (userId: number) => {
    return typingUsers.value.includes(userId);
  };

  const getLastSeen = (userId: number) => {
    return userLastSeen.value[userId] || null;
  };

  // ======================
  // RETURN
  // ======================
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

    // helpers
    isUserOnline,
    isUserTyping,
    getLastSeen,
  };
};

