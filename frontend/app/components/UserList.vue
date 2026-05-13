<script setup lang="ts">
import { useUsers } from "~/composables/useUsers";


const { users, fetchUsers } = useUsers();
const selectedUser = useState("selectedUser");

onMounted(fetchUsers);

const selectUser = (id:number) => {
  selectedUser.value = id
}
</script>

<template>
  <div>
    <h2>Users</h2>
    <div v-for="u in users" :key="u.id" @click="selectUser(u.id)" style="cursor:pointer">
      {{ u.username }}
    </div>
  </div>
</template>

