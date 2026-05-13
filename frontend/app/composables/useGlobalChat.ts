import { Socket } from 'socket.io-client';
import { useApi } from '~/composables/refreshApi';

interface GlobalMessage {
  id: number,
  sender_id: number,
  content: string,
  edited?: boolean,
  deleted?: boolean,
  created_at: string
  username: string
}

interface GlobalTypingPayload {
  userId: number;
}


export const useGlobalChat = () => {
  const { $socket } = useNuxtApp();

  const socket = $socket as Socket;

  const { request } = useApi();

  const messages = useState<GlobalMessage[]>("globalMessages", () => []);
  const globalUsersCount = useState<number>("globalUsersCount", () => 0);
  const typingUsers = useState<number[]>("globalTypingUsers", () => []);




  const fetchGlobalMessages = async () => {
     const res = await request('/api/global')
     messages.value = res as GlobalMessage[];
  }

  const joinGlobal = () => {
    socket.emit("joinGlobal");
  };

  const leaveGlobal = () => {
    socket.emit("leaveGlobal");
  }

  const sendGlobalMessage = (content: string) => {
    if(!content.trim()) {
      return;
    }
     socket.emit("sendGlobalMessage", {
      content
    });
  }

  const editGlobalMessage = (messageId:number, content: string ) => {
    socket.emit("editGlobalMessage", {
      messageId,
      content
    })
  }

  const deleteGlobalMessage = (messageId: number) => {
     socket.emit("deleteGlobalMessage", {
      messageId
     })
  }

  const startGlobalTyping = () => {
    socket.emit("globalTyping")
  }

  const stopGlobalTyping = () => {
    socket.emit("globalStopTyping")
  }

  const initGlobalListeners = () => {
      socket.off("newGlobalMessage");
      socket.off("globalMessageEdited");
      socket.off("globalMessageDeleted");
      socket.off("globalUsersCount");
      socket.off("globalTyping");
      socket.off("globalStopTyping");

      socket.on("newGlobalMessage", (msg: GlobalMessage) => {
            if(!messages.value.some((m) => m.id === msg.id)){
               messages.value.push(msg)
            }
      });

      socket.on("globalMessageEdited", (updated: GlobalMessage) => {
            const index = messages.value.findIndex((m) => m.id === updated.id)
            if(index !== -1){
                messages.value[index] = {...messages.value[index], ...updated}
                
            }
            
      });

      socket.on("globalMessageDeleted", (deleted: GlobalMessage) => {
             const msg = messages.value.find((m) => m.id === deleted.id)

             if(msg) {
                 msg.deleted = true;
                 msg.content = "";
             }
      });

      socket.on("globalUsersCount", (count: number) =>{
              globalUsersCount.value = count;
      });

      socket.on("globalTyping", ({userId}: GlobalTypingPayload) => {
             if(!typingUsers.value.includes(userId)){
                   typingUsers.value.push(userId);
             }
      });

      socket.on("globalStopTyping",  ({userId}: GlobalTypingPayload) => {
              typingUsers.value = typingUsers.value.filter((id) => id !== userId)
      });

}

//   HELPERS 
      const isUserTyping = (userId: number) => {
          return typingUsers.value.includes(userId)
      }


      return {
        //states
        messages,
        globalUsersCount,
        typingUsers,

        // actions
        fetchGlobalMessages,
        joinGlobal,
        leaveGlobal,
        sendGlobalMessage,
        editGlobalMessage,
        deleteGlobalMessage,
        startGlobalTyping,
        stopGlobalTyping,
        initGlobalListeners,

        // helpers
        isUserTyping
      }
}