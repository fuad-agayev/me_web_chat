<template>
  <div class="min-h-screen bg-linear-to-r from-[#101a1d] to-zinc-700 text-zinc-700 flex items-center justify-center p-4 antialiased font-sans">
    
    <div class="bg-linear-to-r from-[#69694c] to-zinc-700 rounded-xl p-12 md:p-16 lg:p-20 shadow-xl w-full max-w-md flex flex-col items-center justify-center border border-zinc-700">
      
      <!-- Centered Form -->
      <div class="w-full flex flex-col justify-center">
        <div class="w-full text-center">
          <h1 class="text-[28px] font-bold text-zinc-700 tracking-tight mb-2">
            Create Your Account
          </h1>
          <p class="text-zinc-700 text-xs font-medium tracking-wide mb-8">
            Join us and start chatting with friends around the world!
          </p>

          <form @submit.prevent="submit" class="space-y-4">
            <!-- Inputs -->
            <input v-model="form.username" type="text" required placeholder="Username"
              class="w-full px-5 py-3.5 rounded-xl bg-linear-to-l from-zinc-400 to-white/70 text-sm text-gray-600 focus:outline-none border focus:border-zinc-700"/>

            <input v-model="form.email" type="email" required placeholder="E-mail Address"
              class="w-full px-5 py-3.5 rounded-xl bg-linear-to-r from-zinc-400 to-white/70 text-sm text-gray-600 focus:outline-none border focus:border-zinc-700"/>

            <input v-model="form.password" type="password" required placeholder="Password"
              class="w-full px-5 py-3.5 rounded-xl bg-linear-to-r from-zinc-400 to-white/70 text-sm text-gray-600 focus:outline-none border focus:border-zinc-700"/>

            <!-- Success Toast -->
            <div v-if="sent" class="p-3 bg-green-50/80 border border-green-100 rounded-xl text-left">
              <p class="text-green-700 text-xs font-medium leading-relaxed">
                Verification email sent! Please check your inbox.
              </p>
            </div>

        

            <!-- Buttons + Link together -->
<div class="pt-4 flex flex-col items-center gap-4">
  <!-- Ana buton -->
  <button 
  type="submit" 
  :disabled="loading || sent || waitingLocation"
  class="bg-linear-to-t from-zinc-400 to-[#a7a68a] cursor-pointer shadow-lg text-zinc-700 font-semibold py-3 px-12 rounded-xl transition-all duration-200 text-xs tracking-wider active:scale-[0.98] flex items-center justify-center gap-2"
>
  <span v-if="loading" class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
  {{ loading ? 'Creating account...' : sent ? 'Email Sent ✓' : 'Create Account' }}
</button>

  <!-- Opsiyonel buton -->
  <button 
    type="button" 
    @click="getLocation"
    class="px-4 py-2 rounded-lg bg-zinc-200 text-zinc-700 text-xs font-medium hover:bg-zinc-300 transition"
  >
      <span v-if="waitingLocation" class="animate-spin w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full"></span>
    📍 Get Location then Create Account <span class="text-[10px] text-zinc-500">(optional)</span>
  </button>

  <!-- Sign In link -->
  <p class="mt-2 text-[14px] text-zinc-400 hover:text-zinc-500 transition-colors font-semibold tracking-wide text-center cursor-pointer">
    Already have an account..? 
    <a href="/login" class="">Sign In</a>
  </p>
</div>

            <!-- Toast Message -->
            <div v-if="toastMessage"
              :class="toastType === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'"
              class="p-3 rounded-xl text-xs font-medium leading-relaxed mt-4">
              {{ toastMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import { ref, reactive } from "vue";

const { register } = useAuth()

const toastMessage = ref("")
const toastType = ref<"success" | "error" | "">("")
const loading = ref(false)
const sent = ref(false)



const form = reactive({
  username: "",
  email: "",
  password: "",
  latitude: null as number | null,
  longitude: null as number | null
});


const waitingLocation = ref(false)

function getLocation() {
  waitingLocation.value = true
  navigator.geolocation.getCurrentPosition((pos) => {
    form.latitude = pos.coords.latitude
    form.longitude = pos.coords.longitude
    waitingLocation.value = false
  }, () => {
    waitingLocation.value = false // icazə verilməsə də spinner dayansın
  })
}



const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return "Bir şeyler yanlış gitti"
}

const submit = async () => {
  loading.value = true
  try {
    await register(form)
    toastMessage.value = "Verification email sent ✔"
    toastType.value = "success"
    sent.value = true
  } catch (err: unknown) {
    toastMessage.value = getErrorMessage(err)
    toastType.value = "error"
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:deep(body) {
  font-family: 'Inter', sans-serif;
}
</style>






