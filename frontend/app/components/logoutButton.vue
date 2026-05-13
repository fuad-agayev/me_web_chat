<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
const { logout } = useAuth();
</script>

<template>
  <button @click="logout">
    Logout
  </button>
</template>