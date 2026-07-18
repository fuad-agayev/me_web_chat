
<script setup lang="ts">
import { reactive, ref } from "vue"
import { useAuth } from "~/composables/useAuth";
import { loginDemo } from "~/composables/demoApi";
import { ChevronLeftIcon } from "@heroicons/vue/24/outline";
const { login, loginWithGoogle } = useAuth()

const form = reactive({
  email: "",
  password: ""
})

const loading = ref(false);
const error = ref("");

const submit = async () => {
  try {
    loading.value = true
    error.value = ""
    const res = await login(form)
    console.log("LOGIN SUCCESS", res)
    await navigateTo("/chat")
  } catch (err: unknown) {
    console.log("LOGIN ERROR", err)
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = "Login failed. Please check your credentials."
    }
  } finally {
    loading.value = false
  }
}

const handleDemoLogin = async () => {
  try {
    loading.value = true;
    const res = await loginDemo();
    console.log("Demo response:", res);
    if (res.user) {
      await navigateTo("/chat");
    }
  } catch (err) {
    console.error("Demo login error:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-linear-to-r from-[#101a1d] to-zinc-700 text-zinc-700 flex flex-col items-center justify-center p-4 antialiased font-sans">
   
    <!-- Login Card -->
    <div class="bg-linear-to-r from-[#69694c] to-zinc-700 rounded-xl p-12 md:p-16 lg:p-20 shadow-xl w-full max-w-md flex flex-col items-center justify-center border border-zinc-700">
      
      <div class="w-full text-center">
        <h1 class="text-[28px] font-bold text-[#333516] tracking-tight mb-2">
          Welcome Back to CHATTING..!
        </h1>
        <p class="text-zinc-700 text-xs font-medium tracking-wide mb-8">
          We Are Happy To Have You Back
        </p>

        <form @submit.prevent="submit" class="space-y-4">
          <!-- Inputs -->
          <input v-model="form.email" type="text" placeholder="Email or Phone Number"
            class="w-full px-5 py-3.5 rounded-xl bg-linear-to-l from-zinc-400 to-white/70 text-sm text-gray-600 focus:outline-none border focus:border-zinc-700"/>
          
          <input v-model="form.password" type="password" placeholder="Password"
            class="w-full px-5 py-3.5 rounded-xl bg-linear-to-r from-zinc-400 to-white/70 text-sm text-gray-600 focus:outline-none border focus:border-zinc-700"/>

          <div class="text-right pr-1">
            <a href="#" class="text-[11px] text-zinc-600 hover:text-yellow-700 transition-colors font-medium">
              Forgot password?
            </a>
          </div>

          <!-- Login + Demo Buttons -->
          <div class="pt-4 flex justify-center gap-4">
            <button type="submit" :disabled="loading"
              class="bg-linear-to-t from-[#333516] to-[#d6d5a6] shadow-lg text-zinc-700 font-semibold py-3 px-12 rounded-xl transition-all duration-200 text-xs tracking-wider active:scale-[0.98]">
              {{ loading ? "Logging in..." : "Login" }}
            </button>

            <button @click="handleDemoLogin" :disabled="loading"
              class="bg-linear-to-t from-[#333516] to-[#d6d5a6] text-zinc-700 py-3 px-12 rounded-xl transition-all duration-200 text-xs tracking-wider shadow-md active:scale-[0.98]">
              {{ loading ? "Loading Demo..." : "Demo" }}
            </button>
          </div>

          <div class="flex items-center my-6">
  <div class="flex-1 h-px bg-zinc-500"></div>
  <span class="px-3 text-xs text-zinc-400">OR</span>
  <div class="flex-1 h-px bg-zinc-500"></div>
</div>

<!-- Google Login -->
<button
  type="button"
  @click="loginWithGoogle"
  class="w-full flex items-center justify-center gap-3 from-[#333516] to-[#d6d5a6] shadow-lg text-zinc-400 font-medium py-3 rounded-xl cursor-pointer transition"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    class="w-4 h-4"
    alt="Google"
  />
  Continue with Google
</button>
          <!-- Sign Up Link -->
           
          <div class="pt-4 text-center">
            <a href="/register" class="text-[14px] text-zinc-700/70 hover:text-zinc-400 transition-colors font-semibold tracking-wide">
              Don't have an account? Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>

    <!-- Back Home Button -->
    <NuxtLink
    to="/"
    class="mt-8 flex items-center justify-center gap-2 bg-linear-to-r from-zinc-400 via-[#f8f2bc] to-100% text-zinc-700 font-semibold py-3 px-10 rounded-xl shadow-md hover:scale-105 transition-transform text-xs tracking-wider"
  >
    <ChevronLeftIcon class="w-5 h-5" />
    <span>Back Home</span>
  </NuxtLink>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
:deep(body) {
  font-family: 'Inter', sans-serif;
}
</style>
