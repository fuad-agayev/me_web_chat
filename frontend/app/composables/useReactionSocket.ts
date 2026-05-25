
import { Socket } from 'socket.io-client';

export function useReactionSocket() {

  const { $socket } = useNuxtApp();
  const socket = $socket as Socket;

  const addGroupReaction = (
    groupId: number,
    messageId: number,
    emoji: string
  ): void => {

    socket.emit("addGroupReaction", {
      groupId,
      messageId,
      emoji
    });
  };

  const removeGroupReaction = (
    groupId: number,
    messageId: number,
    emoji: string
  ): void => {

    socket.emit("removeGroupReaction", {
      groupId,
      messageId,
      emoji
    });
  };

  const addPrivateReaction = (
    messageId: number,
    receiverId: number,
    emoji: string
  ): void => {

    socket.emit("addPrivateReaction", {
      messageId,
      receiverId,
      emoji
    });
  };

  const removePrivateReaction = (
    messageId: number,
    receiverId: number,
    emoji: string
  ): void => {

    socket.emit("removePrivateReaction", {
      messageId,
      receiverId,
      emoji
    });
  };


  onMounted(() => {
  socket.on("groupReactionAdded", ({ messageId, reaction, emoji }) => {
    // həmin mesajın reaction-larını UI-də yenilə
  });

  socket.on("groupReactionRemoved", ({ messageId, userId, emoji }) => {
    // həmin mesajdan reaction sil
  });

  socket.on("privateReactionAdded", (reaction) => {
    // private mesajda reaction göstər
  });

  socket.on("privateReactionRemoved", ({ messageId, userId, emoji }) => {
    // private mesajdan reaction sil
  });
});

onUnmounted(() => {
  socket.off("groupReactionAdded");
  socket.off("groupReactionRemoved");
  socket.off("privateReactionAdded");
  socket.off("privateReactionRemoved");
});


  return {
    addGroupReaction,
    removeGroupReaction,
    addPrivateReaction,
    removePrivateReaction
  };
}