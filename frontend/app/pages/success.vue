<template>
  <div
    class="min-h-screen bg-zinc-900 flex flex-col items-center justify-center"
  >
    <!-- Logo -->
    <img
      src="/chat_app.png"
      alt="Chat App"
      class="w-20 h-20 rounded-2xl shadow-xl mb-8 animate-pulse"
    />

    <!-- Spinner -->
    <div
      class="w-10 h-10 border-4 border-zinc-600 border-t-[#74b38e] rounded-full animate-spin"
    ></div>

    <!-- Text -->
    <h2 class="mt-6 text-sm font-bold text-[#ececc3]">
      Signing you in... <br/>

      ✓ Verifying account<br/>
      ✓ Loading profile<br/>
      ⟳ Preparing chat...
    </h2>

    <p class="mt-2 text-sm text-zinc-400">
       Please wait while we prepare your account.
    </p>
  </div>
</template>

<script setup lang="ts">
const { fetchProfile } = useAuth();

onMounted(async () => {
  try {
    await fetchProfile();
    await navigateTo("/chat");
  } catch {
    await navigateTo("/login");
  }
});
</script>