
<template>
  <audio v-if="props.src" controls 
  class="w-full sm:w-64 md:w-80 lg:w-96 h-12 mt-2">
  <source :src="props.src" type="audio/mpeg" />
  <source :src="props.src" type="audio/m4a" />
  <source :src="props.src" type="audio/webm" />
</audio>

</template>

<script setup lang="ts">
const props = defineProps<{ src: string }>();
console.log("AudioPlayer src prop:", props.src);
</script>
