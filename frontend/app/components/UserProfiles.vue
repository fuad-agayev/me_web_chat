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
  <div v-if="selectedUser" class="flex flex-col gap-4 text-white/50">
    <!-- Avatar + info -->
    <div class="flex items-center gap-4 border border-zinc-500 rounded-xl p-2">
      <img
        :src="selectedUser.avatar || '/default-avatar.png'"
        alt="avatar"
        class="w-12 h-12 rounded-xl border border-zinc-500"
      />
      <div>
        <h3 class="text-lg font-semibold">{{ selectedUser.username }}</h3>
        <p class="text-sm text-zinc-300">{{ selectedUser.email }}</p>
      </div>
    </div>

    <!-- Online / Offline + Last seen -->
    <div class="w-full h-14 border border-zinc-600 flex items-center px-2">
      <div v-if="isUserOnline(selectedUser.id)">
        <span class="online">🟢 Online</span>
      </div>
      <div v-else>
        <span class="offline">
          ⚪ Offline • Last seen: {{ formatLastSeen(getLastSeen(selectedUser.id)) }}
        </span>
      </div>
    </div>

    <!-- Xəritə -->
    <GeoLocMap
      v-if="selectedUser.latitude && selectedUser.longitude"
      :lat="selectedUser.latitude"
      :lng="selectedUser.longitude"
    />

    <!-- Location -->
    <div v-if="selectedUser.latitude != null && selectedUser.longitude != null" class="mt-2 text-md text-zinc-400 flex flex-col items-center justify-center py-4">
      <p>📍 Location: {{ selectedUser.latitude }}, {{ selectedUser.longitude }}</p>
    </div>
  </div>
</template>









