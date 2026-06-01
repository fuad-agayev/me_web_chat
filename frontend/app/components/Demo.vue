<script setup lang="ts">

import { loginDemo } from "~/composables/demoApi";

const loading = ref(false);

const handleDemoLogin =
  async () => {

    try {

      loading.value = true;

      await loginDemo();

      await navigateTo("/chat");

    } catch (err) {

      console.error(err);

    } finally {

      loading.value = false;
    }
};

</script>

<template>

  <button
    @click="handleDemoLogin" class="cursor-pointer">
    Demo Login
  </button>

</template>