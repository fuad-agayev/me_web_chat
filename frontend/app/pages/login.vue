<script setup lang="ts">
import { reactive, ref } from "vue"
 import { useAuth } from "~/composables/useAuth";
import { loginDemo } from "~/composables/demoApi";

 const { login } = useAuth()

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
      error.value = err.message   // güvenli erişim
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
  <div class="min-h-screen bg-[#1d2836] flex items-center justify-center p-4 antialiased font-sans">
    
    <div class="bg-[#1d2836] rounded-3xl p-12 md:p-16 lg:p-20 shadow-[0_10px_50px_rgba(0,0,0,0.03)] w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-6 border border-white/40">
      
      <div class="w-full md:w-[45%] flex flex-col justify-center">
        <div class="w-full max-w-sm mx-auto mb-4 md:mx-0 text-center md:text-left">
          <h1 class="text-[28px] font-bold text-[#c8cce4] tracking-tight mb-2">
            Welcome Back to Chat_Web!
          </h1>
          <p class="text-[#bcc0d5] text-xs font-medium tracking-wide mb-8">
            We Are Happy To Have You Back
          </p>

          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <input
                v-model="form.email"
                type="text"
                placeholder="Email or Phone Number"
                class="w-full px-5 py-3.5 rounded-xl bg-white placeholder-[#c1c4d6] text-sm text-gray-700 focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] transition-all border border-transparent focus:border-[#4d537c]/20"
              />
            </div>

            <div class="relative">
              <input
                v-model="form.password"
                type="password"
                placeholder="Password"
                class="w-full px-5 py-3.5 rounded-xl bg-white placeholder-[#c1c4d6] text-sm text-gray-700 focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] transition-all border border-transparent focus:border-[#4d537c]/20"
              />
            </div>

            <div class="text-right pr-1">
              <a href="#" class="text-[11px] text-[#8e93b1] hover:text-[#4d537c] transition-colors font-medium">
                Forgot password?
              </a>
            </div>

            <div class="pt-4 flex justify-center md:justify-start">
              <button
                type="submit"
                :disabled="loading"
                class="bg-[#3a3f58] hover:bg-[#2e3247] text-white cursor-pointer font-semibold py-3 px-14 rounded-xl transition-all duration-200 text-xs tracking-wider shadow-md active:scale-[0.98]"
              >
                {{ loading ? "Logging in..." : "Login" }}
              </button>

              <a href="/register" class="ml-6 text-[11px] text-[#8e93b1] hover:text-[#4d537c] transition-colors font-semibold tracking-wide py-2">
                Don't have an account? Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>

      <div class="w-full md:w-[50%] flex flex-col items-center justify-center">
        
        <div class="w-full max-w-100 aspect-3xl flex items-end justify-center relative select-none">
          
          <div class="absolute bottom-0 left-4 right-4 h-px bg-gray-300/70"></div>

          <svg viewBox="0 0 400 240" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M194 92 L200 86 L206 92" stroke="#e1e1e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            
            <g id="girl-character">
              <rect x="91" y="160" width="6" height="58" rx="3" fill="#5856d6"/>
              <rect x="103" y="160" width="6" height="58" rx="3" fill="#5856d6"/>
              <ellipse cx="94" cy="218" rx="5" ry="2" fill="#23233c"/>
              <ellipse cx="106" cy="218" rx="5" ry="2" fill="#23233c"/>
              <path d="M84 135 C84 125, 116 125, 116 135 L113 162 L87 162 Z" fill="#2d314e"/>
              <path d="M84 135 L76 156 C75 159, 78 161, 80 158 L86 142" stroke="#5856d6" stroke-width="5" stroke-linecap="round"/>
              <path d="M116 135 L124 156 C125 159, 122 161, 120 158 L114 142" stroke="#5856d6" stroke-width="5" stroke-linecap="round"/>
              <rect x="97" y="116" width="6" height="12" fill="#7567f7"/>
              <circle cx="100" cy="104" r="14" fill="#7567f7"/>
              <circle cx="100" cy="86" r="6" fill="#433aa8"/>
              <path d="M87 100 C86 90, 114 90, 113 100" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.6"/>
              <circle cx="96" cy="103" r="1.5" fill="#23233c"/>
              <path d="M101 106 C101 108, 104 108, 104 106" stroke="#23233c" stroke-width="1" stroke-linecap="round"/>
            </g>

            <g id="smartphone">
              <rect x="156" y="50" width="50" height="100" rx="10" fill="#222538" stroke="#222538" stroke-width="2"/>
              <rect x="158" y="52" width="46" height="96" rx="8" fill="#ffffff"/>
              <rect x="166" y="78" width="30" height="4" rx="2" fill="#e2e4ed"/>
              <rect x="166" y="86" width="22" height="4" rx="2" fill="#e2e4ed"/>
              <path d="M158 132 C168 132, 174 140, 172 148 L158 148 Z" fill="#5856d6"/>
              <path d="M173 52 L187 52 C187 55, 173 55, 173 52 Z" fill="#222538"/>
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

         <!-- Demo Login -->
      <div class="pt-10 flex justify-center md:justify-start">
       <button
    @click="handleDemoLogin"
    :disabled="loading"
    class="bg-[#3a3f58] hover:bg-[#2e3247] text-white cursor-pointer font-semibold py-3 px-14 rounded-xl transition-all duration-200 text-xs tracking-wider shadow-md active:scale-[0.98]"
  >
    {{ loading ? "Loading Demo..." : "Demo" }}
  </button>
      </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Google Font importu ile tipografiyi görseldeki estetiğe yaklaştırıyoruz */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:deep(body) {
  font-family: 'Inter', sans-serif;
}
</style>

