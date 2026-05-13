<script setup>
import { useAuth } from "~/composables/useAuth"
const { login } = useAuth();

const form = reactive({
  email: "",
  password: ""
});

const loading = ref(false);
const error = ref("");

const submit = async () => {
  try {
    const res = await login(form);

    console.log("LOGIN SUCCESS", res);

    await navigateTo("/chat");
  } catch (e) {
    console.log("LOGIN ERROR", e);
  }
};
</script>

<template>
  <div class="container">

    <div class="card">

      <h1>Login</h1>
      <p class="subtitle">Welcome back 👋</p>

      <input
        v-model="form.email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="form.password"
        type="password"
        placeholder="Password"
      />

      <p v-if="error" class="error">
        {{ error }}
      </p>

      <button
        @click="submit"
        :disabled="loading"
      >
        {{ loading ? "Loading..." : "Login" }}
      </button>

      <p class="link">
        Don't have account?
        <NuxtLink to="/register">Register</NuxtLink>
      </p>

    </div>

  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f6fa;
}

.card {
  width: 320px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h1 {
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: gray;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  padding: 10px;
  background: black;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.error {
  color: red;
  font-size: 13px;
}

.link {
  font-size: 13px;
  text-align: center;
}
</style>

