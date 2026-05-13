<template>
  <div>
    {{ message.content }}
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: number;
  content: string;
  sender?: string;
}

defineProps<{ message: Message }>();
</script>

