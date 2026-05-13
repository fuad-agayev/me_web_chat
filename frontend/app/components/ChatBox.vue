
 <template>
  <div v-if="selectedUser" class="chat-box">
    <!-- HEADER -->
    <div class="chat-header">
      <h2>Chat</h2>

      <!--  ONLINE / OFFLINE -->
      <div v-if="isUserOnline(selectedUser)">
        <span class="online">🟢 Online</span>
      </div>

      <div v-else>
        <span class="offline">
          ⚪ Offline • Last seen:
          {{ formatLastSeen(getLastSeen(selectedUser)) }}
        </span>
      </div>

      <!-- TYPING -->
      <div v-if="isUserTyping(selectedUser)">
        typing...
      </div>
    </div>

    <!-- MESSAGES -->
    <div class="messages">
      <div
        v-for="m in messages"
        :key="m.id"
        :style="{
          textAlign: m.sender_id === user?.id ? 'right' : 'left',
          marginBottom: '10px'
        }"
      >
        <span
          :style="{
            background: m.sender_id === user?.id ? '#DCF8C6' : '#eee',
            padding: '8px',
            borderRadius: '10px',
            display: 'inline-block',
            maxWidth: '70%'
          }"
        >
          <template v-if="m.deleted">
            <i>Message deleted</i>
          </template>

          <template v-else>
            {{ m.content }}
            <small v-if="m.edited"> (edited)</small>
          </template>
        </span>

        <!-- STATUS -->
        <div
          v-if="m.sender_id === user?.id"
          style="font-size: 12px; color: gray;"
        >
          <span v-if="m.read">✔✔ Read</span>
          <span v-else-if="m.delivered">✔✔ Delivered</span>
          <span v-else>✔ Sent</span>
        </div>

        <!-- TIME -->
        <div style="font-size: 11px; color: gray;">
          {{ formatTime(m.created_at) }}
        </div>

        <!-- ACTIONS -->
        <div v-if="m.sender_id === user?.id && !m.deleted">
          <button @click="startEdit(m)">Edit</button>
          <button @click="removeMessage(m.id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- EDIT MODE -->
    <div v-if="editingMessageId">
      <input v-model="editText" />
      <button @click="saveEdit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>

    <!-- SEND -->
    <div v-else>
      <input
        v-model="text"
        placeholder="Mesaj yaz..."
        @input="handleTyping"
        @blur="stopTyping"
      />
      <button @click="send">Send</button>
    </div>
  </div>

  <div v-else>
    Select user
  </div>
</template>

<script setup lang="ts">
import { useChat } from "~/composables/useChat";
import { useAuth } from "~/composables/useAuth";

const {
  messages,
  sendMessage,
  fetchMessages,
  selectedUser,
  initListeners,
  startTyping,
  stopTyping,
  isUserOnline,
  isUserTyping,
  getLastSeen
} = useChat();

const { $socket } = useNuxtApp();
const { user } = useAuth();

const text = ref("");
const editingMessageId = ref<number | null>(null);
const editText = ref("");

// ======================
// INIT SOCKET
// ======================
onMounted(() => {
  initListeners();
   $socket.emit("getOnlineUsers");
});

// ======================
// FETCH MESSAGES
// ======================
watch(selectedUser, async (newUser) => {
  if (!newUser) return;

  await fetchMessages();
});

// ======================
// SEND MESSAGE
// ======================
const send = () => {
  if (!text.value.trim()) return;

  sendMessage(text.value);

  text.value = "";

  stopTyping();
};

// ======================
// TYPING
// ======================
const handleTyping = () => {
  text.value.trim() ? startTyping() : stopTyping();
};

// ======================
// MARK READ (SAFE VERSION)
// ======================
watch(selectedUser, (newUser) => {
  if (!newUser) return;

  messages.value.forEach((m) => {
    if (
      m.sender_id === newUser &&
      m.receiver_id === user.value?.id &&
      !m.read
    ) {
      $socket.emit("messageRead", {
        messageId: Number(m.id),
        senderId: Number(m.sender_id),
      });

      m.read = true;
    }
  });
});

// ======================
// DELIVERED
// ======================
watch(
  messages,
  (list) => {
    list.forEach((msg) => {
      if (
        msg.receiver_id === user.value?.id &&
        !msg.delivered
      ) {
        $socket.emit("messageDelivered", {
          messageId: Number(msg.id),
          senderId: Number(msg.sender_id),
        });

        msg.delivered = true;
      }
    });
  },
  { deep: true }
);

// ======================
// DELETE
// ======================
const removeMessage = (id: number) => {
  if (!selectedUser.value) return;

  $socket.emit("deleteMessage", {
    messageId: Number(id),
    receiver_id: Number(selectedUser.value),
  });
};

// ======================
// EDIT
// ======================
const startEdit = (m: any) => {
  editingMessageId.value = m.id;
  editText.value = m.content;
};

const saveEdit = () => {
  if (!editingMessageId.value || !selectedUser.value) return;

  $socket.emit("editMessage", {
    messageId: Number(editingMessageId.value),
    content: editText.value,
    receiver_id: Number(selectedUser.value),
  });

  editingMessageId.value = null;
  editText.value = "";
};

const cancelEdit = () => {
  editingMessageId.value = null;
  editText.value = "";
};

// ======================
// FORMATTERS
// ======================
const formatTime = (date?: string) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatLastSeen = (date?: string | null) => {
  if (!date) return "recently";

  return new Date(date).toLocaleString();
};
</script>

<style scoped>
.chat-box {
  padding: 20px;
}

.chat-header {
  margin-bottom: 20px;
}

.online {
  color: green;
  font-weight: 600;
}

.offline {
  color: gray;
  font-size: 14px;
}

.messages {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}
</style>
