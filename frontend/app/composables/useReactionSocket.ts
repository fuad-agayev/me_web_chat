
import { Socket } from 'socket.io-client';

export function useReactionSocket() {

  const { $socket } = useNuxtApp();
  const socket = $socket as Socket;

  

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

  socket.on("privateReactionAdded", (reaction) => {
    // private mesajda reaction göstər
  });

  socket.on("privateReactionRemoved", ({ messageId, userId, emoji }) => {
    // private mesajdan reaction sil
  });
});

onUnmounted(() => {
  socket.off("privateReactionAdded");
  socket.off("privateReactionRemoved");
});


  return {
    addPrivateReaction,
    removePrivateReaction
  };
}