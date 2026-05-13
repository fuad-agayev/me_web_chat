
<template>
  <div class="layout">

    <!-- LEFT -->
    <aside class="sidebar">
      <h2>Users</h2>
      <UserList />
    </aside>

    <!-- CENTER -->
    <main class="center">

      <!-- TABS -->
      <div class="tabs">
        <button
          :class="{ active: mode === 'private' }"
          @click="mode = 'private'"
        >
          Private
        </button>

        <button
          :class="{ active: mode === 'global' }"
          @click="mode = 'global'"
        >
          🌍 Global
        </button>
      </div>

      <!-- CHAT AREA -->
      <ChatBox v-if="mode === 'private'" />
      <global v-else />

    </main>

    <!-- RIGHT -->
    <aside class="right">
      <UserProfiles />
    </aside>

  </div>
</template>

<script setup>
definePageMeta({ middleware: "auth" })
const mode = ref("private");
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  height: 100vh;
}

.sidebar {
  background: #111;
  color: white;
  padding: 15px;
}

.center {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.right {
  background: #fafafa;
  border-left: 1px solid #ddd;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  background: white;
  cursor: pointer;
}

.tabs button.active {
  background: #4CAF50;
  color: white;
}
</style>

