
<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-zinc-800 px-4">
    <div class="bg-zinc-800 rounded-xl shadow-lg p-6 md:p-10 w-full max-w-md border border-slate-200">
      
      <h2 class="text-2xl font-bold text-center text-[#94e0bd] mb-4">
        Reset Your Password
      </h2>
      <p class="text-sm text-slate-300 text-center mb-6">
        Enter and confirm your new password.
      </p>

      <form @submit.prevent="reset" class="space-y-4">
        <input 
          v-model="newPassword" 
          type="password" 
          placeholder="New password"
          class="w-full px-4 py-3 rounded-lg text-gray-200 border border-gray-600 focus:outline-none"
        />
        <input 
          v-model="confirmPassword" 
          type="password" 
          placeholder="Confirm password"
          class="w-full px-4 py-3 rounded-lg text-gray-200 border border-gray-600 focus:outline-none"
        />

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3 rounded-lg bg-[#6fe4ad] text-gray-900 font-semibold hover:bg-[#4b6e5e] transition-colors"
        >
          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>
      </form>

      <p v-if="error" class="text-red-400 text-sm text-center mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const loading = ref(false);

const route = useRoute();
const router = useRouter();

const reset = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = "Passwords don't match";
    return;
  }

   if (newPassword.value.length < 8) {
    error.value = "Password must be at least 8 characters long";
    return;
  }
  if (!/[A-Z]/.test(newPassword.value) || !/[0-9]/.test(newPassword.value)) {
    error.value = "Password must contain at least one uppercase letter and one number";
    return;
  }

  const token = route.query.token;
  const config = useRuntimeConfig();

  try {
    loading.value = true;
    await $fetch(`${config.public.apiBase}/api/auth/reset-password`, {
      method: "POST",
      body: { token, newPassword: newPassword.value }
    });
    alert("Password reset successfully");
    router.push("/login");
  } catch (err) {
    error.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
