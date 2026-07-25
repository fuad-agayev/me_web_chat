<template>
 <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
  <div class="bg-linear-to-br from-zinc-900 to-zinc-700 rounded-2xl p-8 w-96 shadow-2xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-[#cfc9ac]">
      🔒 Change Password
    </h2>
    <form @submit.prevent="submit" class="space-y-4">
      <input 
        v-model="oldPassword" 
        type="password" 
        placeholder="Old Password" 
        class="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#cfc9ac]"
      />
      <input 
        v-model="newPassword" 
        type="password" 
        placeholder="New Password" 
        class="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#cfc9ac]"
      />
      <input 
        v-model="confirmPassword" 
        type="password" 
        placeholder="Confirm New Password" 
        class="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#cfc9ac]"
      />

      <div class="flex justify-end gap-4 mt-6">
        <button 
          type="button" 
          @click="$emit('close')" 
          class="px-4 py-2 rounded-lg bg-zinc-600 text-zinc-200 hover:bg-zinc-400 transition"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 rounded-lg bg-[#cfc9ac] text-zinc-900 font-semibold hover:bg-[#69ce96] transition"
        >
          Update
        </button>
      </div>
    </form>
    <div class="relative inline-block">
      <Transition
  enter-active-class="transition duration-200"
  leave-active-class="transition duration-200"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
  <div
    v-if="errPopMessage"
    class="absolute top-full left-16 px-4 rounded-md border border-[#d4cd88] py-2 text-md text-slate-300 shadow-lg whitespace-nowrap z-50"
  >
    {{ errPopMessage }}
  </div>
</Transition>
    </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["close"]);

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errPopMessage = ref("");


const submit = async () => {
  errPopMessage.value = "";

  if (newPassword.value !== confirmPassword.value) {
    errPopMessage.value = "Passwords do not match.";

    setTimeout(() => {
      errPopMessage.value = "";
    }, 3000);

    return;
  }

  try {
    const config = useRuntimeConfig();

    await $fetch(`${config.public.apiBase}/api/users/changepassword`, {
      method: "PATCH",
      body: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      },
      credentials: "include"
    });

    errPopMessage.value = "✅ Password updated successfully.";

    setTimeout(() => {
      emit("close");
    }, 1500);

  } catch (err: any) {
    errPopMessage.value =
      err?.data?.message || "Failed to update password.";

    setTimeout(() => {
      errPopMessage.value = "";
    }, 3000);
  }
};
</script>


