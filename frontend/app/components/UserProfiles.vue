
<script setup lang="ts">
import GeoLocMap from './GeoLocMap.vue';
// props ile seçili kullanıcıyı alıyoruz
import { useChat } from "~/composables/useChat";



defineProps<{
  selectedUser?: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    latitude?: number | null;
    longitude?: number | null;
  };
}>();


const {
  isUserOnline,
  getLastSeen
} = useChat();
const formatLastSeen = (date?: string | null) => {
  if (!date) return "recently";
  return new Date(date).toLocaleString();
};
</script>
<template>
  <div v-if="selectedUser" class="flex flex-col gap-4 text-white/50 w-full max-w-2xl mx-auto p-2">
    
    <div class="flex flex-col sm:flex-row items-center gap-4 border border-zinc-500 rounded-xl p-4">
      <img
        :src="selectedUser.avatar || '/chat_app.png'"
        alt="avatar"
        class="w-20 h-20 rounded-xl border border-zinc-500 object-cover"
      />
      <div class="text-center sm:text-left">
        <h3 class="text-lg font-semibold text-white">{{ selectedUser.username }}</h3>
        <p class="text-sm text-zinc-300">{{ selectedUser.email }}</p>
      </div>
    </div>

    <div class="w-full min-h-14 border border-zinc-600 flex items-center justify-center sm:justify-start px-4 text-sm rounded-lg">
      <div v-if="isUserOnline(selectedUser.id)">
        <span class="online text-green-500 font-medium">🟢 Online</span>
      </div>
      <div v-else>
        <span class="offline text-zinc-400">
          ⚪ Offline • Last seen: {{ formatLastSeen(getLastSeen(selectedUser.id)) }}
        </span>
      </div>
    </div>

    <GeoLocMap
      v-if="selectedUser.latitude && selectedUser.longitude"
      :key="selectedUser.id" 
      :lat="selectedUser.latitude"
      :lng="selectedUser.longitude"
      class="w-full h-64 rounded-xl overflow-hidden border border-zinc-700"
    />

    <div v-if="selectedUser.latitude != null && selectedUser.longitude != null" class="text-sm text-zinc-200 flex flex-col items-center justify-center py-2 border-t border-zinc-800">
      <p class="break-all text-center">📍 Location: {{ selectedUser.latitude }}, {{ selectedUser.longitude }}</p>
    </div>
    
  </div>
</template>




