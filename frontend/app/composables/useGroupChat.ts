import { Socket } from 'socket.io-client';


interface MessageGroup {
  id: number,
  group_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  username?: string;
  avatar?: string;
  edited?: boolean;
  deleted?: boolean;
}

export function useGroupSocket(groupId: number){

   const messages = ref<MessageGroup[]>([]);
   const typingUsers = ref<number[]>([]);


  const { $socket } = useNuxtApp();
  const socket = $socket as Socket;


   const joinGroup = (): void => {
     socket.emit("joinGroup", groupId);
   };

   const leaveGroup = (): void => {
    socket.emit("leaveGroup", groupId);
   };

   const sendMessage = (content: string): void => {
      socket.emit("sendGroupMessage", {
        groupId,
        content
      })
   }


   const typing = (): void => {
      socket.emit("typingGroup", {
        groupId
      })
   };

   const stopTyping = (): void => {
    socket.emit("groupStopTyping", {
      groupId
    })
   };

   const editMessage = (messageId: number, content: string): void => {
        socket.emit("editGroupMessage", {
          groupId, messageId, content
        })
   };

   const deleteMessage = (messageId: number): void => {
      socket.emit("deleteGroupMessage", {
        groupId,
        messageId
      })
   };

   onMounted(() => {

    joinGroup();

    socket.on("newGroupMessage", (msg: MessageGroup) => {
      messages.value.push(msg)
    });

    socket.on("groupMessageEdited", (updated: MessageGroup) => {
         const index = messages.value.findIndex(m => m.id === updated.id);
         if(index !== -1) {
           messages.value[index] = updated;
         }
    });

    socket.on(
      "groupMessageDeleted",
      (deleted: MessageGroup) => {

        const index = messages.value.findIndex(
          m => m.id === deleted.id
        );

        if (index !== -1) {
          messages.value[index] = deleted;
        }
      }
    );

    socket.on("groupTyping", ({userId}: {userId: number} ) => {
       if(!typingUsers.value.includes(userId)){
           typingUsers.value.push(userId);
       }
    }
   );

   socket.on("groupStopTyping", ({userId}: {userId: number}) => {
        typingUsers.value = typingUsers.value.filter(id => id !== userId)
   })
   
   });


   onUnmounted(() => {

     leaveGroup();

    socket.off("newGroupMessage");
    socket.off("groupMessageEdited");
    socket.off("groupMessageDeleted");
    socket.off("groupTyping");
    socket.off("groupStopTyping");
   })

 return {
    messages,
    typingUsers,
    joinGroup,
    leaveGroup,
    sendMessage,
    typing,
    stopTyping,
    editMessage,
    deleteMessage
  };



}
