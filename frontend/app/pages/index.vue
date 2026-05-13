<script setup lang="ts">
onMounted(() => {
  navigateTo("/login");
});
</script>

<template>
  <div class="center">
    Loading...
  </div>
</template>

<style scoped>
.center {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: gray;
}
</style>