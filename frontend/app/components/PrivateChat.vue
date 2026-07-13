
<script setup lang="ts">
import { useChat } from "~/composables/useChat";
import { useAuth } from "~/composables/useAuth";
import { nextTick, ref, watch, onMounted } from "vue";

const props = defineProps<{ selectedUser: any }>();

const { 
  messages, 
  sendMessage, 
  fetchMessages, 
  initListeners, 
  startTyping, 
  stopTyping 
} = useChat();

const { user } = useAuth();

const text = ref("");
const editingMessageId = ref<number | null>(null);
const editText = ref("");
const messagesContainer = ref<HTMLDivElement | null>(null);
const shouldAutoScroll = ref(true);

// Selected user değiştiğinde mesajları getir
watch(() => props.selectedUser?.id, async (newId) => {
  if (!newId) return;
  await fetchMessages(newId);
  scrollToBottom();
}, { immediate: true });

onMounted(() => {
  initListeners();
});

// Scroll Kontrolü
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value && shouldAutoScroll.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const onScroll = () => {
  const container = messagesContainer.value;
  if (!container) return;
  shouldAutoScroll.value = container.scrollTop + container.clientHeight > container.scrollHeight - 150;
};

// ==================== SEND MESSAGE ====================
const send = () => {
  if (!text.value.trim() || !props.selectedUser?.id) return;

  // Composable üzerinden gönder (doğru yol)
  sendMessage(text.value, props.selectedUser.id);

  text.value = "";
  shouldAutoScroll.value = true;
  scrollToBottom();
};

// Typing
const handleTyping = () => {
  if (!props.selectedUser?.id) return;
  text.value.trim() 
    ? startTyping(props.selectedUser.id) 
    : stopTyping(props.selectedUser.id);
};

// Edit
const startEdit = (m: any) => {
  editingMessageId.value = m.id;
  editText.value = m.content;
};

const saveEdit = () => {
  if (!editingMessageId.value || !props.selectedUser?.id) return;
  const socket = useNuxtApp().$socket;
  socket.emit("editMessage", {
    messageId: editingMessageId.value,
    content: editText.value,
    receiver_id: props.selectedUser.id,
  });
  editingMessageId.value = null;
  editText.value = "";
};

const cancelEdit = () => {
  editingMessageId.value = null;
  editText.value = "";
};

const removeMessage = (id: number) => {
  if (!props.selectedUser?.id) return;
  const socket = useNuxtApp().$socket;
  socket.emit("deleteMessage", {
    messageId: id,
    receiver_id: props.selectedUser.id,
  });
};

watch(messages, scrollToBottom, { deep: true });
</script>

<template>
  <div class="flex flex-col h-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
    
    <!-- Header -->
    <div class="flex items-center gap-3 p-4 border-b border-zinc-800 bg-zinc-800">
      <img 
        :src="selectedUser?.avatar || '/default-avatar.png'" 
        class="w-10 h-10 rounded-2xl ring-2 ring-zinc-700"
      />
      <div>
        <h3 class="font-semibold text-white">{{ selectedUser?.username }}</h3>
        <p class="text-xs text-emerald-400">● Online</p>
      </div>
    </div>

    <!-- Messages -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-5 space-y-7 scrollbar-thin scrollbar-thumb-zinc-700 bg-zinc-950"
      @scroll="onScroll"
    >
      <div v-for="m in messages" :key="m.id" 
           :class="m.sender_id === user?.id ? 'flex justify-end' : 'flex justify-start'">

        <!-- Diğer kişinin mesajı (SOL) -->
        <div v-if="m.sender_id !== user?.id" class="flex gap-3 max-w-[75%]">
          <img 
            :src="selectedUser?.avatar || '/default-avatar.png'" 
            class="w-9 h-9 rounded-2xl flex-shrink-0 mt-1 ring-2 ring-zinc-700"
          />
          <div>
            <div class="bg-zinc-800 px-5 py-3 rounded-3xl rounded-bl-none text-[15px] text-zinc-100">
              {{ m.content }}
              <small v-if="m.edited" class="text-xs text-zinc-500"> (edited)</small>
            </div>
            <p class="text-xs text-zinc-500 mt-1 pl-2">
              {{ new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>
        </div>

        <!-- Kendi mesajın (SAĞ) -->
        <div v-else class="flex gap-3 max-w-[75%] flex-row-reverse">
          <div>
            <div class="bg-gradient-to-br from-amber-400 to-yellow-400 px-5 py-3 rounded-3xl rounded-br-none text-zinc-900 text-[15px] shadow">
              {{ m.content }}
              <small v-if="m.edited" class="text-xs text-amber-800"> (edited)</small>
            </div>
            <p class="text-xs text-right text-zinc-500 mt-1 pr-2">
              {{ new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 border-t border-zinc-800 bg-zinc-900">
      <div v-if="editingMessageId" class="flex gap-2 mb-3">
        <input v-model="editText" class="flex-1 bg-zinc-800 border border-amber-400 rounded-3xl px-5 py-3" />
        <button @click="saveEdit" class="px-6 bg-emerald-600 rounded-3xl">Save</button>
        <button @click="cancelEdit" class="px-6 bg-red-600 rounded-3xl">Cancel</button>
      </div>

      <div v-else class="flex items-center gap-3">
        <input
          v-model="text"
          @input="handleTyping"
          @blur="() => stopTyping(selectedUser?.id)"
          @keyup.enter="send"
          placeholder="Mesaj yaz..."
          class="flex-1 bg-zinc-800 border border-zinc-700 focus:border-amber-400 rounded-3xl px-6 py-4 text-white placeholder-zinc-500 outline-none"
        />
        <button 
          @click="send"
          :disabled="!text.trim()"
          class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 text-zinc-900 rounded-3xl text-3xl flex items-center justify-center disabled:opacity-50"
        >
          ↑
        </button>
      </div>
    </div>
  </div>

  
</template>
