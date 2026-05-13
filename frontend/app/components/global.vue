<template>
  <div class="global">

    <h2>🌍 Global Chat</h2>

    <div>Online: {{ globalUsersCount }}</div>

    <div class="messages">
      <div v-for="m in messages" :key="m.id">
        <b>{{ m.username }}</b>:
        {{ m.deleted ? "deleted" : m.content }}
      </div>
    </div>

    <div v-if="typingUsers.length">
      ✍️ typing...
    </div>

    <input
      v-model="text"
      @input="startGlobalTyping"
      @blur="stopGlobalTyping"
    />

    <button @click="send">Send</button>

  </div>
</template>

<script setup lang="ts">
import { useGlobalChat } from "~/composables/useGlobalChat";

const {
  messages,
  globalUsersCount,
  typingUsers,
  sendGlobalMessage,
  startGlobalTyping,
  stopGlobalTyping,
  fetchGlobalMessages,
  initGlobalListeners,
  joinGlobal,
  leaveGlobal
} = useGlobalChat();

const text = ref("");

// lifecycle
onMounted(async () => {
  joinGlobal();
  await fetchGlobalMessages();
  initGlobalListeners();
});

onUnmounted(() => {
  leaveGlobal();
});

const send = () => {
  if (!text.value.trim()) return;

  sendGlobalMessage(text.value);
  text.value = "";
};
</script>

<style scoped>
.global {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  padding: 10px;
  background: #4CAF50;
  color: white;
  display: flex;
  justify-content: space-between;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.msg {
  margin-bottom: 10px;
}

.deleted {
  color: gray;
  font-style: italic;
}

.typing {
  padding: 5px 10px;
  font-size: 12px;
  color: gray;
}

.input {
  display: flex;
  padding: 10px;
  gap: 10px;
}

.input input {
  flex: 1;
  padding: 8px;
}

.input button {
  padding: 8px 12px;
  background: #4CAF50;
  color: white;
  border: none;
}
</style>