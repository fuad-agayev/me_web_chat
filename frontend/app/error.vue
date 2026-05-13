<template>
  <div class="error-page">
    <img src="../err.png" alt="404 Error" class="error-image" />
    <h1>Sorry, the page not found</h1>
    <p>The link you followed probably broken or the page has been removed.</p>
    <NuxtLink to="/" class="home-link">Go back home !!!</NuxtLink>
  </div>
</template>

<script setup>
// Bu sayfa otomatik olarak Nuxt'un error handling mekanizmasında kullanılır.
// İstersen özel error layout'u da tanımlayabilirsin.
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
  color: #333;
  text-align: center;
}
.error-image {
  max-width: 400px;
  margin-bottom: 20px;
}
.home-link {
  margin-top: 20px;
  padding: 10px 20px;
  background: #333;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
}
.home-link:hover {
  background: #555;
}
</style>
