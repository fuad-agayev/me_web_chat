<template>
  <div class="container">
    <h1>📩 Check your email</h1>

    <p>
      We sent a verification link to your email address.
      Please verify your account before login.
    </p>

    <NuxtLink to="/login">
      Go to Login
    </NuxtLink>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

