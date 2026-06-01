<template>
  <div class="min-h-screen bg-[#1d2836] flex items-center justify-center p-4 antialiased font-sans">
    
    <div class="bg-[#1d2836] rounded-24 p-12 md:p-16 lg:p-20 shadow-[0_10px_50px_rgba(0,0,0,0.03)] w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-6 border border-white/40">
      
      <div class="w-full md:w-[45%] flex flex-col justify-center">
        <div class="w-full max-w-sm mx-auto md:mx-0 text-center md:text-left">
          <h1 class="text-[28px] font-bold text-[#cbcee2] tracking-tight mb-2">
            Create Your Account
          </h1>
          <p class="text-[#b8bcd3] text-xs font-medium tracking-wide mb-8">
            Join us and start chatting with friends around the world!
          </p>

          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <input
                v-model="form.username"
                type="text"
                required
                placeholder="Username"
                class="w-full px-5 py-3.5 rounded-xl bg-white placeholder-[#c1c4d6] text-sm text-gray-700 focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] transition-all border border-transparent focus:border-[#4d537c]/20"
              />
            </div>

            <div>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="E-mail Address"
                class="w-full px-5 py-3.5 rounded-xl bg-white placeholder-[#c1c4d6] text-sm text-gray-700 focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] transition-all border border-transparent focus:border-[#4d537c]/20"
              />
            </div>

            <div>
              <input
                v-model="form.password"
                type="password"
                required
                placeholder="Password"
                class="w-full px-5 py-3.5 rounded-xl bg-white placeholder-[#c1c4d6] text-sm text-gray-700 focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] transition-all border border-transparent focus:border-[#4d537c]/20"
              />
            </div>

            <div v-if="sent" class="p-3 bg-green-50/80 border border-green-100 rounded-xl text-left">
              <p class="text-green-700 text-xs font-medium leading-relaxed">
                Verification email sent! Please check your inbox.
              </p>
            </div>

            <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                :disabled="loading || sent"
                class="w-full sm:w-auto bg-[#3a3f58] hover:bg-[#2e3247] disabled:bg-[#3a3f58]/60 text-white font-semibold py-3 px-12 rounded-xl transition-all duration-200 text-xs tracking-wider shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span v-if="loading" class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                {{ loading ? 'Creating account...' : sent ? 'Email Sent ✓' : 'Create Account' }}
              </button>

              <a href="/login" class="text-[11px] text-[#6bb17e] hover:text-[#4d537c] transition-colors font-semibold tracking-wide py-2">
                Already have an account? Sign In
              </a>
            </div>
            <div v-if="toastMessage"
     :class="toastType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'"
     class="p-3 rounded-xl text-xs font-medium leading-relaxed mt-4">
  {{ toastMessage }}
</div>

          </form>
        </div>
      </div>

      <div class="w-full md:w-[50%] flex flex-col items-center justify-center">
        
        <div class="w-full max-w-100 aspect-4/3 flex items-end justify-center relative select-none">
          
          <div class="absolute bottom-0 left-4 right-4 h-px bg-gray-300/70"></div>

          <svg viewBox="0 0 400 240" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M194 92 L200 86 L206 92" stroke="#e1e1e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            
            <g id="girl-character">
              <rect x="91" y="160" width="6" height="58" rx="3" fill="#5856d6"/>
              <rect x="103" y="160" width="6" height="58" rx="3" fill="#5856d6"/>
              <ellipse cx="94" cy="218" rx="5" ry="2" fill="#23233c"/>
              <ellipse cx="106" cy="218" rx="5" ry="2" fill="#23233c"/>
              <path d="M84 135 C84 125, 116 125, 116 135 L113 162 L87 162 Z" fill="#2d314e"/>
              <path d="M84 135 L74 148 C72 151, 75 154, 78 152 L86 142" stroke="#5856d6" stroke-width="5" stroke-linecap="round"/>
              <path d="M116 135 L126 146 C128 148, 131 145, 128 142 L118 138" stroke="#5856d6" stroke-width="5" stroke-linecap="round"/>
              <rect x="97" y="116" width="6" height="12" fill="#7567f7"/>
              <circle cx="100" cy="104" r="14" fill="#7567f7"/>
              <circle cx="100" cy="86" r="6" fill="#433aa8"/>
              <path d="M87 100 C86 90, 114 90, 113 100" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.6"/>
              <circle cx="96" cy="103" r="1.5" fill="#23233c"/>
              <path d="M101 106 C101 108, 104 108, 104 106" stroke="#23233c" stroke-width="1" stroke-linecap="round"/>
            </g>

            <g id="register-card">
              <rect x="156" y="44" width="54" height="110" rx="8" fill="#222538" stroke="#222538" stroke-width="2"/>
              <rect x="158" y="46" width="50" height="106" rx="6" fill="#ffffff"/>
              <circle cx="183" cy="66" r="10" fill="#e2e4ed"/>
              <rect x="167" y="86" width="32" height="3.5" rx="1.5" fill="#e2e4ed"/>
              <rect x="167" y="94" width="32" height="3.5" rx="1.5" fill="#e2e4ed"/>
              <rect x="167" y="102" width="32" height="3.5" rx="1.5" fill="#e2e4ed"/>
              <rect x="171" y="120" width="24" height="8" rx="4" fill="#5856d6"/>
              <circle cx="183" cy="124" r="1.5" fill="#ffffff"/>
            </g>

            <g id="boy-character">
              <rect x="291" y="160" width="6" height="58" rx="3" fill="#5856d6"/>
              <rect x="303" y="160" width="6" height="58" rx="3" fill="#5856d6"/>
              <ellipse cx="294" cy="218" rx="5" ry="2" fill="#23233c"/>
              <ellipse cx="306" cy="218" rx="5" ry="2" fill="#23233c"/>
              <rect x="283" y="132" width="26" height="30" rx="2" fill="#2d314e"/>
              <rect x="278" y="132" width="5" height="22" rx="2.5" fill="#f5caaf"/>
              <rect x="309" y="132" width="5" height="22" rx="2.5" fill="#f5caaf"/>
              <rect x="293" y="122" width="6" height="10" fill="#f5caaf"/>
              <circle cx="296" cy="110" r="14" fill="#f5caaf"/>
              <path d="M282 106 C282 92, 310 92, 310 102 C302 100, 294 98, 282 106 Z" fill="#4d476e"/>
              <circle cx="291" cy="111" r="1.2" fill="#23233c"/>
              <circle cx="299" cy="111" r="1.2" fill="#23233c"/>
              <path d="M293 117 Q295 119 297 117" stroke="#23233c" stroke-width="1" stroke-linecap="round" fill="none"/>
            </g>
          </svg>
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
  password: ""
})

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






