<template>
  <div>
      <div>Email verified ✔</div>
  </div>
</template>

<script setup lang="ts">
     const route = useRoute();
     const config = useRuntimeConfig();

onMounted(async () => {
  if (!route.query.token) return;

  try {
    await $fetch(`${config.public.apiBase}/api/auth/verify`, {
      query: {
        token: route.query.token
      }
    });

    // 🔥 kullanıcıyı login sayfasına gönder
    navigateTo("/login");

  } catch (err) {
    console.error("Verify error:", err);
  }
});

</script>