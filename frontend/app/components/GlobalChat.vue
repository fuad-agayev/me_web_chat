
<script setup lang="ts">
import { useGlobalChat } from "~/composables/useGlobalChat";
import { useAuth } from "~/composables/useAuth";
import { nextTick, ref, watch, computed, onMounted, onUnmounted } from "vue";
import type { GlobalMessage } from "~/composables/useGlobalChat";

import AudioPlayer from "~/components/AudioPlayer.vue";
import VoiceRecorder from "~/components/VoiceRecorder.vue";
import { useGlobalAudioMessages } from "../composables/useGlobalMessages";



const { sendGlobalAudioMessage } = useGlobalAudioMessages();
const { user } = useAuth();



const {
  messages,
  typingUsers,
  globalOnlineUsers,
  sendGlobalMessage,
  startGlobalTyping,
  stopGlobalTyping,
  fetchGlobalMessages,
  initGlobalListeners,
  joinGlobal,
  leaveGlobal,
  fetchGlobalOnlineUsers,
  cleanupGlobalListeners,
  editGlobalMessage,
  deleteGlobalMessage
} = useGlobalChat();

const limit = 20;
const offset = ref(0);
const text = ref("");
const messagesContainer = ref<HTMLDivElement | null>(null);
const shouldAutoScroll = ref(true);   // ← Yeni: Kontrollü scroll
const activeMessage = ref<number | null>(null);
const voiceMessages = ref<File[]>([]);

const editMessage = (m: GlobalMessage) => {
  const result = window.prompt("Edit message:", m.content) as string | null;
  if (result !== null && result.trim() !== "") {
    editGlobalMessage(m.id, result.trim());
  }
};

const loadMessages = async () => {
  const container = messagesContainer.value;
  if (!container) return;
  const oldHeight = container.scrollHeight;
  const res = await fetchGlobalMessages(limit, offset.value);
  if (res.length) {
    messages.value.unshift(...res.reverse());
    offset.value += limit;
    await nextTick();
    const newHeight = container.scrollHeight;
    container.scrollTop += newHeight - oldHeight;
  }
};

const onScroll = () => {
  const container = messagesContainer.value;
  if (!container) return;

  // Kullanıcı yukarı scroll ederse auto-scroll'ü kapat
  if (container.scrollTop + container.clientHeight < container.scrollHeight - 100) {
    shouldAutoScroll.value = false;
  } else {
    shouldAutoScroll.value = true;
  }

  if (container.scrollTop <= 20) {
    loadMessages();
  }
};

const scrollToBottom = async () => {
  await nextTick();
  const container = messagesContainer.value;
  if (container && shouldAutoScroll.value) {
    container.scrollTop = container.scrollHeight;
  }
};

// Yeni mesaj geldiğinde otomatik scroll
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

const playSendSound = () => {
  const audio = new Audio('/sounds/swish_voice.mp3');
  audio.play();
};


// Send mesajı
const send = () => {
  if (!text.value.trim()) return;
  sendGlobalMessage(text.value);
  text.value = "";
  shouldAutoScroll.value = true; // Kendi mesajımızda kesin alta in
  scrollToBottom();
  playSendSound();
};

onMounted(async () => {
  joinGlobal();
  await loadMessages();
  await fetchGlobalOnlineUsers();
  initGlobalListeners(messagesContainer, user.value ? user.value : undefined);
  
  // İlk yüklemede alta git
  nextTick(() => scrollToBottom());
});

onUnmounted(() => {
  leaveGlobal();
  cleanupGlobalListeners();
});

const groupedMessages = computed(() => {
  const sorted = [...messages.value].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const groups = new Map<string, GlobalMessage[]>();
  const today = new Date().toLocaleDateString("en-EN");
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-EN");

  for (const m of sorted) {
    const msgDate = new Date(m.created_at);
    const day = msgDate.toLocaleDateString("en-EN");
    let label: string;
    if (day === today) label = "Today";
    else if (day === yesterday) label = "Yesterday";
    else {
      const diffDays = Math.floor((Date.now() - msgDate.getTime()) / 86400000);
      label = diffDays <= 7 
        ? msgDate.toLocaleDateString("en-US", { weekday: "long" })
        : msgDate.toLocaleDateString("en-EN", { day: "2-digit", month: "short", year: "numeric" });
    }
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(m);
  }
  return Object.fromEntries(groups);
});

const toggleActions = (id: number) => {
  activeMessage.value =
    activeMessage.value === id
      ? null
      : id;
};

let timer: any;

const startPress = (id: number) => {
  timer = setTimeout(() => {
    toggleActions(id);
  }, 600);
};

const stopPress = () => {
  clearTimeout(timer);
};


const handleGlobalFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    const res = await sendGlobalAudioMessage(file); // upload + audio_url
    sendGlobalMessage("", res.audio_url);           // socket emit
  }
};

const handleGlobalRecorderStop = async (file: File, mode: string) => {
  if (mode === "global") {
    const res = await sendGlobalAudioMessage(file);
    sendGlobalMessage("", res.audio_url);
  }
};

</script>

<template>
  <!-- ... Template aynı kalabilir, sadece header ikonunu düzelttim ... -->
  <div class="global flex flex-col h-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
    
    <!-- Header -->
    <div class="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-b border-zinc-800 bg-zinc-800 shadow-md shadow-[#666e43]">
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-[#666e43] to-[#c7d683] rounded-xl flex items-center justify-center text-lg sm:text-xl">
          🌐
        </div>
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-white">Global Chat</h2>
          <p class="text-[10px] sm:text-xs text-zinc-500">Everyone is here</p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <div v-if="typingUsers.length" class="text-emerald-400 text-xs sm:text-sm flex items-center gap-1.5">
          <span class="animate-pulse">●</span>
          <span class="italic">{{ typingUsers.join(", ") }} typing...</span>
        </div>

        <div class="flex items-center gap-2 bg-zinc-800 px-2 sm:px-3 py-1 rounded-full">
          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span class="text-emerald-400 text-xs sm:text-sm font-medium">
            {{ globalOnlineUsers.length }} online
          </span>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div 
      ref="messagesContainer" 
      class="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600"
      @scroll="onScroll"
    >
      <!-- ... Mevcut mesaj template'in aynı kalabilir ... -->
      <div v-for="(msgs, day) in groupedMessages" :key="day">
        <div class="flex items-center gap-2 sm:gap-4 my-6 sm:my-8">
          <div class="h-px flex-1 bg-linear-to-r from-transparent via-zinc-700 to-transparent"></div>
          <span class="px-3 sm:px-6 py-1 bg-zinc-900 text-zinc-400 text-xs sm:text-sm font-medium rounded-full border border-zinc-800">
            {{ day }}
          </span>
          <div class="h-px flex-1 bg-linear-to-r from-transparent via-zinc-700 to-transparent"></div>
        </div>

        <div v-for="m in msgs" :key="m.id" class="group">
          <!-- Mesaj içeriği (önceki tasarımın) -->
          <div :class="['flex gap-2 sm:gap-3 max-w-full sm:max-w-[75%]', m.sender_id === user?.id ? 'ml-auto flex-row-reverse' : '']">
            <div class="flex flex-col">
              <div class="flex items-center gap-2 mb-1 px-1">
                <img :src="m.avatar || '/chat_app.png'" alt="Avatar" class="w-7 h-7 sm:w-9 sm:h-9 rounded-xl ring-2 ring-zinc-800 shrink-0 border border-zinc-700" />
                <span class="text-[11px] sm:text-xs font-semibold text-white">{{ m.username }}</span>
                <span class="text-[10px] sm:text-xs text-zinc-500">
                  {{ new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </span>

                
              </div>

              <div
               @contextmenu.prevent="toggleActions(m.id)"
               @touchstart="startPress(m.id)"
               @touchend="stopPress"
               @touchmove="stopPress"
               :class="['px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-[15px] leading-relaxed shadow-lg relative', 
              
                m.sender_id === user?.id 
                ? 'bg-linear-to-r from-[#7f8176] to-[#f2f7dc] text-zinc-800 rounded-tr-none'
                : 'bg-zinc-800 text-zinc-300 rounded-tl-none border border-zinc-700']">
                <template v-if="m.deleted">
                  <span class="italic text-zinc-500">Message deleted</span>
                </template>
                <div v-else class="flex flex-col gap-2">
  <p v-if="m.content" class="whitespace-pre-wrap break-all">{{ m.content }}</p>
  <AudioPlayer v-if="m.audio_url" :src="m.audio_url" />
</div>
                 
                <div 
                     v-if="m.sender_id === user?.id"
                     :class="[
                      'absolute -top-1 -right-1 flex gap-1 transition-all',
                       activeMessage === m.id
      ? 'opacity-100'
      : 'opacity-0 group-hover:opacity-100'
  ]"
                 class="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button @click="editMessage(m)" class="text-xs bg-zinc-900 hover:bg-zinc-800 text-yellow-400 w-6 h-6 rounded-full flex items-center justify-center shadow">✎</button>
                  <button @click="deleteGlobalMessage(m.id)" class="text-xs bg-zinc-900 hover:bg-zinc-800 text-red-400 w-6 h-6 rounded-full flex items-center justify-center shadow">🗑</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

   <!-- Bu dogru olan global chat input alanı -->
<!-- Input Area -->
<div class="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900">
  <form @submit.prevent="send" class="flex flex-col gap-3">
    
    <!-- 1-ci sıra: Input + Send -->
    <div class="flex items-center gap-2 sm:gap-3">
      <input
        v-if="user"
        v-model="text"
        @input="startGlobalTyping(user.id, user.username)"
        @blur="stopGlobalTyping(user.id, user.username)"
        @keyup.enter="send"
        placeholder="Type a message..."
        class="flex-1 bg-zinc-800 border border-zinc-700 focus:border-[#666e43] 
               rounded-3xl px-4 sm:px-6 py-2 sm:py-3 
               text-sm sm:text-base text-white placeholder-zinc-500 
               outline-none transition-all"
      />

      <button 
        @click="send"
        :disabled="!text.trim()"
        class="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center 
               bg-linear-to-br from-[#b4c279] to-[#c6d484] 
               hover:from-[#a9b672] hover:to-[#666e43] 
               disabled:opacity-50 disabled:cursor-not-allowed 
               rounded-2xl text-zinc-900 font-bold 
               text-lg sm:text-2xl transition-all active:scale-95"
      >
        ↑
      </button>
    </div>

    <!-- 2-ci sıra: Fayl + Mikrofon -->
    <div class="flex gap-3 items-center">
      <label class="cursor-pointer">
        📎
        <input 
          type="file" 
          accept="audio/*" 
          class="hidden"
          @change="handleGlobalFileChange"
        />
      </label>
      <VoiceRecorder mode="global" @stop="handleGlobalRecorderStop" />
    </div>

  </form>
</div>
<!---     Bu dogru olan global chat input alanı-->


  </div>
</template>
