<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { useChat } from "~/composables/useChat";
import { useAuth } from "~/composables/useAuth";

import AudioPlayer from "~/components/AudioPlayer.vue";
import VoiceRecorder from "~/components/VoiceRecorder.vue";
import { usePrivateMessages } from "../composables/usePrivateMessages.js";

const { user } = useAuth(); 

const props = defineProps<{
  selectedUser: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    audio_url?:string;
  } | null;
}>();


const {
  messages,
  selectedUser: chatSelectedUser,
  fetchMessages,
  sendMessage,
  startTyping,
  stopTyping,
  initListeners,
  addReaction,
  removeReaction,
  isUserTyping,
  isUserOnline
} = useChat();


const { sendAudioMessage} = usePrivateMessages(messages,user);



const messageInput = ref("");
const editingMessageId = ref<number | null>(null);
const editInput = ref("");
const activeEmojiMenuId = ref<number | null>(null);

const messageListRef = ref<HTMLElement | null>(null);
const quickEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const markAllAsRead = () => {
  if (!props.selectedUser || !messages.value.length) return;
  const { $socket } = useNuxtApp();
  
  const unreadMessages = messages.value.filter(
    m => Number(m.sender_id) === Number(props.selectedUser!.id) && !m.read
  );
  
  unreadMessages.forEach(msg => {
    ($socket as any).emit("messageRead", {
      messageId: Number(msg.id),
      senderId: Number(props.selectedUser!.id)
    });
    msg.read = true;
  });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

watch(() => props.selectedUser, async (newUser) => {
  if (newUser) {
    chatSelectedUser.value = Number(newUser.id);
    await fetchMessages(newUser.id);
    //initListeners();
    scrollToBottom();
    markAllAsRead();
  } else {
    chatSelectedUser.value = null;
  }
}, { immediate: true });

watch(messages, () => {
  scrollToBottom();
  markAllAsRead();
}, { deep: true });

onMounted(() => {
  initListeners();
  scrollToBottom();
});


let typingTimeout: NodeJS.Timeout;
const handleKeyDown = () => {
  if (!props.selectedUser) return;
  startTyping(props.selectedUser.id);
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    stopTyping(props.selectedUser!.id);
  }, 2000);
};

const handleSend = () => {
  if (!messageInput.value.trim() || !props.selectedUser) return;
  sendMessage(messageInput.value, props.selectedUser.id);
  messageInput.value = "";
  stopTyping(props.selectedUser.id);
};

const startEdit = (msg: any) => {
  editingMessageId.value = msg.id;
  editInput.value = msg.content;
};

const saveEdit = (msgId: number) => {
  if (!editInput.value.trim() || !props.selectedUser) return;
  const { $socket } = useNuxtApp();
  ($socket as any).emit("editMessage", {
    messageId: msgId,
    content: editInput.value,
    receiverId: props.selectedUser.id
  });
  editingMessageId.value = null;
};

const deleteMsg = (msgId: number) => {
  if (!props.selectedUser) return;
  const { $socket } = useNuxtApp();
  ($socket as any).emit("deleteMessage", {
    messageId: msgId,
    receiverId: props.selectedUser.id
  });
};




const toggleReaction = (msgId: number, emoji: string) => {
  if (!props.selectedUser || !user.value) return;
  
  const msg = messages.value.find(m => Number(m.id) === Number(msgId));
  if (!msg) return;

  const currentUserId = Number(user.value.id || (user.value as any)._id);
  
  // Döngü içinde her bir reaksiyonun kime ait olduğunu kontrol et
  const existingReaction = msg.reactions?.find((r: any) => {
    const rUserId = Number(r.userId || r.user_id);
    return rUserId === currentUserId && r.emoji.trim() === emoji.trim();
  });

  if (existingReaction) {
    // EĞER VARSA SİL
    removeReaction(Number(msgId), emoji, Number(props.selectedUser.id));
  } else {
    // YOKSA EKLE
    addReaction(Number(msgId), emoji, Number(props.selectedUser.id));
  }
  
  activeEmojiMenuId.value = null; 
};



const toggleEmojiMenu = (msgId: number) => {
  activeEmojiMenuId.value = activeEmojiMenuId.value === msgId ? null : msgId;
};


const handleFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file && chatSelectedUser.value) {
    const res = await sendAudioMessage(file, chatSelectedUser.value);
    sendMessage("", chatSelectedUser.value, res.audio_url); // socket emit
  }
};

const handleRecorderStop = async (file: File, mode: string) => {
  if (mode === "private" && chatSelectedUser.value) {
    const res = await sendAudioMessage(file, chatSelectedUser.value);
    sendMessage("", chatSelectedUser.value, res.audio_url);
  }
};
</script>

<template>
  <div class="flex flex-col h-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-700">
    
    <div v-if="selectedUser" class="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-700">
      <div class="flex items-center gap-3">
        <img 
          :src="selectedUser.avatar || '/chat_app.png'" 
          class="w-10 h-10 rounded-full object-cover border border-zinc-600"
          alt="Avatar"
        />
        
        <div>
          <h2 class="text-base font-bold text-white">{{ selectedUser.username }}</h2>
          <p v-if="isUserTyping(selectedUser.id)" class="text-xs text-green-400 animate-pulse font-medium">
            typing...
          </p>
          <p v-else class="text-xs text-zinc-400"> Private Talks </p>
        </div>
      </div>
    </div>

    <div v-if="!selectedUser" class="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8">
      <span class="text-4xl mb-2">💬</span>
      <p class="text-lg font-semibold"> Begin chats </p>
      <p class="text-sm text-zinc-600">Select user to chat.</p>
    </div>

    <div v-else ref="messageListRef" class="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-900/40">
      
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="flex flex-col max-w-[85%]"
        :class="Number(msg.sender_id) === Number(user?.id || (user as any)?._id) ? 'ml-auto items-end' : 'mr-auto items-start'"
      >
       <!-- yoxlama -->
  {{ console.log("PrivateChat msg.audio_url:", msg.audio_url) }}
        <div class="flex items-end gap-2 w-full" :class="Number(msg.sender_id) === Number(user?.id || (user as any)?._id) ? 'justify-end' : 'justify-start'">
          
          <img 
            v-if="Number(msg.sender_id) !== Number(user?.id || (user as any)?._id)"
            :src="selectedUser.avatar || '/chat_app.png'"
            class="w-8 h-8 rounded-full object-cover border border-zinc-700 mr-1 shrink-0 mb-1"
            alt="Partner avatar"
          />

          <div 
            v-if="Number(msg.sender_id) === Number(user?.id || (user as any)?._id) && !msg.deleted && editingMessageId !== msg.id"
            class="flex items-center gap-2 mr-1 bg-zinc-900/60 p-1 rounded-lg border border-zinc-800 shrink-0"
          >
            <button @click="startEdit(msg)" class="text-zinc-400 hover:text-blue-400 text-xs cursor-pointer" title="Düzenle">✏️</button>
            <button @click="deleteMsg(msg.id)" class="text-zinc-400 hover:text-red-400 text-xs cursor-pointer" title="Sil">🗑️</button>
          </div>

          <div class="relative">
            
            <div 
              v-if="activeEmojiMenuId === msg.id && !msg.deleted"
              class="absolute flex items-center gap-1.5 bg-zinc-800 border border-zinc-600 rounded-full px-2.5 py-1.5 shadow-2xl z-30 -top-12 transition-all"
              :class="Number(msg.sender_id) === Number(user?.id || (user as any)?._id) ? 'right-0' : 'left-0'"
            >
              <button 
                v-for="emoji in quickEmojis" 
                :key="emoji"
                @click="toggleReaction(msg.id, emoji)"
                class="hover:scale-130 active:scale-95 transition text-sm px-1 py-0.5 cursor-pointer"
              >
                {{ emoji }}
              </button>
            </div>

            <div 
              class="px-4 py-2.5 rounded-2xl text-sm shadow-md relative"
              :class="[
                msg.deleted 
                  ? 'bg-zinc-800 text-zinc-500 italic border border-zinc-700/50' 
                  : Number(msg.sender_id) === Number(user?.id || (user as any)?._id)
                    ? 'bg-linear-to-br from-[#777c5c] to-[#585a45] text-white rounded-tr-none' 
                    : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
              ]"
            >
              <div v-if="editingMessageId === msg.id" class="flex flex-col gap-2 min-w-50">
                <input 
                  v-model="editInput" 
                  type="text" 
                  class="w-full bg-zinc-700 text-white text-xs p-1.5 rounded border border-zinc-500 focus:outline-none"
                  @keyup.enter="saveEdit(msg.id)"
                />
                <div class="flex justify-end gap-2 text-[10px]">
                  <button @click="editingMessageId = null" class="text-zinc-400 hover:text-white cursor-pointer">İptal</button>
                  <button @click="saveEdit(msg.id)" class="text-green-400 font-bold hover:text-green-300 cursor-pointer">Kaydet</button>
                </div>
              </div>

              
                   <div v-else>
  <p v-if="msg.deleted" class="flex items-center gap-1 text-xs text-zinc-500">
    🚫 This message deleted
  </p>
  <div v-else class="flex flex-col gap-2">
  <p v-if="msg.content" class="whitespace-pre-wrap break-all">{{ msg.content }}</p>
  <AudioPlayer v-if="msg.audio_url" :src="msg.audio_url" class="w-full sm:w-64 md:w-80 lg:w-96 h-12 mt-2"/>
  </div>
</div>
<!--         
              <div v-else>
                <p v-if="msg.deleted" class="flex items-center gap-1 text-xs text-zinc-500">
                  🚫 This message deleted
                </p>
                <p v-else class="whitespace-pre-wrap break-all">{{ msg.content }}</p>
              </div>
              -->
            



              <span v-if="msg.edited && !msg.deleted" class="text-[9px] text-zinc-400 block text-right mt-0.5">
                (edited)
              </span>
            </div>
          </div>

          <img 
            v-if="Number(msg.sender_id) === Number(user?.id || (user as any)?._id)"
            :src="user?.avatar || '/chat_app.png'"
            class="w-8 h-8 rounded-full object-cover border border-zinc-700 ml-1 shrink-0 mb-1"
            alt="My avatar"
          />

        </div>

        <div class="flex items-center gap-2 mt-1.5 flex-wrap" :class="Number(msg.sender_id) === Number(user?.id || (user as any)?._id) ? 'mr-10' : 'ml-10'">
          
          <button 
            v-if="!msg.deleted"
            @click="toggleEmojiMenu(msg.id)"
            class="text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded-full transition cursor-pointer"
          >
            ➕
          </button>

          <div v-if="msg.reactions && msg.reactions.length > 0" class="flex gap-1 flex-wrap">
            <button 
              v-for="(r, idx) in msg.reactions" 
              :key="idx"
              @click="toggleReaction(msg.id, r.emoji)"
              class="text-[11px] bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5 text-zinc-300 shadow-sm hover:bg-zinc-700 hover:scale-105 transition cursor-pointer"
              :class="{'border-emerald-500/50 bg-emerald-950/20': Number(r.userId || (r as any).user_id) === Number(user?.id || (user as any)?._id)}"
            >
              {{ r.emoji }}
            </button>
          </div>

          <span class="text-[10px] text-zinc-500">
            {{ msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' }}
          </span>

          <div v-if="Number(msg.sender_id) === Number(user?.id || (user as any)?._id) && !msg.deleted" class="text-[11px] flex items-center">
            <span v-if="msg.read" class="text-emerald-400 font-bold tracking-tighter" title="Okundu">✓✓</span>
            <span v-else-if="msg.delivered" class="text-zinc-500 font-bold" title="İletildi">✓</span>
            <span v-else class="text-zinc-500 text-[10px] animate-pulse" title="Beklemede">🕒</span>
          </div>
        </div>

      </div>
    </div>

<!--  Bu dogur olnlar       -->
<div v-if="selectedUser" class="p-4 bg-zinc-900 border-t border-zinc-700/70">
  <form @submit.prevent="handleSend" class="flex flex-col gap-2">
    
    <!-- 1-ci sıra: Input + Send -->
    <div class="flex items-center gap-2">
      <input 
        v-model="messageInput"
        @keydown="handleKeyDown"
        type="text" 
        placeholder="Mesajınızı yazın..." 
        class="flex-1 rounded-xl bg-zinc-800 border border-zinc-700 
               text-sm sm:text-base text-zinc-200 
               px-2 py-1.5 sm:px-4 sm:py-2.5 
               focus:outline-none focus:ring-2 focus:ring-[#777c5c]"
      />

      <button 
        type="submit"
        :disabled="!messageInput.trim()"
        class="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center 
               bg-linear-to-br from-[#b4c279] to-[#c6d484] 
               hover:from-[#74dfb2] hover:to-[#9fdbb8] 
               disabled:opacity-50 disabled:cursor-not-allowed 
               rounded-2xl text-zinc-900 font-bold 
               text-lg sm:text-2xl transition-all active:scale-95"
      >
        ↑
      </button>
    </div>

    <!-- 2-ci sıra: İkon + Mikrofon -->
    <div class="flex gap-2 items-center justify-between">
      <label class="cursor-pointer">
        📎
        <input 
          type="file" 
          accept="audio/*" 
          class="hidden"
          @change="handleFileChange"
        />
      </label>
      <VoiceRecorder mode="private" @stop="handleRecorderStop" />
    </div>

  </form>
</div>
<!--       Bu dogu olanlar   -->

  </div>
</template>
