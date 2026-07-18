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
          class="px-4 py-2 rounded-lg bg-zinc-600 text-zinc-200 hover:bg-zinc-500 transition"
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
  </div>
 </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["close"]);

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const submit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }
  const config = useRuntimeConfig();
  await $fetch(`${config.public.apiBase}/api/users/changepassword`, {
    method: "PATCH",
    body: { oldPassword: oldPassword.value, newPassword: newPassword.value },
    credentials: "include",
  });
  alert("Password updated successfully");
  // Modalı kapat
  emit("close"); 
};
</script>


