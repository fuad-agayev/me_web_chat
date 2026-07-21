<template>
  <div v-if="showForgot" class="mt-4">
    <form @submit.prevent="forgot" class="space-y-3">
      <input 
        v-model="email" 
        type="email" 
        placeholder="Enter your email"
        class="w-full px-4 py-2 rounded-lg border focus:outline-none text-zinc-300"
      />
      <button 
        type="submit" 
        class="w-full px-4 py-2 rounded-lg bg-[#6fe4ad] text-zinc-700 font-bold cursor-pointer"
      >
        Get Reset Link by Email
      </button>
    </form>

    <!-- Success mesajı -->
    <p v-if="successMessage" class="text-green-400 text-sm mt-2 text-center">
      {{ successMessage }}
    </p>

    <!-- Error mesajı -->
    <p v-if="errorMessage" class="text-red-400 text-sm mt-2 text-center">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const successMessage = ref("");
const errorMessage = ref("");

const props = defineProps<{ showForgot: boolean }>();
const emit = defineEmits(["close"]);

const forgot = async () => {
  const config = useRuntimeConfig();
  try {
    await $fetch(`${config.public.apiBase}/api/auth/forgot-password`, {
      method: "POST",
      body: { email: email.value }
    });

    successMessage.value = "Reset link sent to your email";

    // 2 saniye sonra formu kapat
    setTimeout(() => {
      emit("close");
    }, 2000);
  } catch (err) {
    errorMessage.value = "Something went wrong. Please try again.";
  }
};
</script>
