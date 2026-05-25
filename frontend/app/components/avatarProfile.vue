<template>
  <div>
    <input type="file" @change="handleFile" />
    <img :src="backendUrl + user.avatar" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const config = useRuntimeConfig();
const backendUrl = config.public.apiBase; // .env-dən də oxuya bilərsən
const user = ref({ avatar: "" });

const handleFile = async (e:any) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch("/api/users/avatar", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();
  console.log(data.avatar);

  // avatar yolunu yenilə
  user.value.avatar = data.avatar;
};
</script>
