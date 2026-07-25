
<script setup lang="ts">
import { useUsers } from "~/composables/useUsers";
import { useAuth } from "~/composables/useAuth"
import { computed } from "vue";
const props = defineProps<{ mode: "private" | "global"; search: string;}>();
const emit = defineEmits(["select"]);

const { user } = useAuth();
const { users, fetchUsers } = useUsers();
const selectedUser = ref<number | null>(null);

watch(() => props.mode, async (newMode) => {
  await fetchUsers(newMode); // mode-ə görə user-ləri çəkirik
});

const selectUser = (u: any) => {
  if (u.id === user.value?.id) {
    return;
  }

  selectedUser.value = u.id;
  emit("select", u); // seçilən user-i parent-ə göndəririk
};


const filteredUsers = computed(() => {
  if (!props.search.trim()) {
    return users.value;
  }
  return users.value.filter(u =>
    u.username
      .toLowerCase()
      .includes(props.search.toLowerCase())
  );
});

onMounted(() => {
  fetchUsers(props.mode); // ilk açılışda user-ləri yüklə
});
</script>

<template>
  <div class="w-full space-y-2">
    <div
      v-for="u in filteredUsers"
      :key="u.id"
      @click="selectUser(u)"
      class="group relative flex items-center rounded-xl cursor-pointer transition-all duration-300 overflow-hidden space-x-2 p-1"
      :class="[
  u.id === user?.id
    ? 'opacity-50 cursor-not-allowed'
    : '',

  selectedUser === u.id
    ? 'bg-linear-to-r from-[#69694c] to-zinc-400 shadow-2xl scale-[1.02]'
    : 'bg-linear-to-r from-zinc-100 to-[#777c5c] hover:from-zinc-200 hover:via-[#777c5c] hover:to-zinc-400 shadow-md hover:shadow-xl hover:scale-[1.01]'
]"
    >
      <!-- Avatar -->
      <div class="relative z-10 w-10 h-10 rounded overflow-hidden border-2 border-white/40 shadow-lg shrink-0">
        <img v-if="u.avatar" :src="u.avatar" :alt="u.username" class="w-full h-full object-cover rounded-lg"/>
        <div v-else class="w-full h-full flex items-center justify-center bg-linear-to-br from-zinc-600 to-zinc-800 text-white font-bold text-lg rounded-lg">
          {{ u.username?.charAt(0).toUpperCase() }}
        </div>
      </div>

      <!-- User Info -->
      <div class="relative z-10 flex-1 min-w-0">
        <h3 class="font-semibold text-lg truncate" :class="selectedUser === u.id ? 'text-white' : 'text-zinc-800'">
          {{ u.username }}
        </h3>
        <p class="text-sm truncate" :class="selectedUser === u.id ? 'text-zinc-200' : 'text-zinc-500'">
          ID:{{ u.id }}
        </p>
         
      </div>
    </div>
  </div>
</template>
