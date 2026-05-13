<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
const { user, fetchProfile, logout } = useAuth();

onMounted(() => {
  fetchProfile();
});
</script>
<template>
  <div class="header" v-if="user">
    <span>👤 {{ user?.username }}</span>
    <button @click="logout">Logout</button>
  </div>
</template>

