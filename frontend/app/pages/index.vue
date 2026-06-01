<script setup lang="ts">
import { ref } from 'vue'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  UserIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import SidebarItem from '~/components/SidebarItem.vue'

const open = ref(false)
</script>

<template>
  <div class="relative h-screen bg-linear-to-br from-[#464653] to-[#34343b] overflow-hidden flex">

    <!-- SIDEBAR -->
    <aside
      :class="open ? 'w-72' : 'w-24'"
      class="absolute left-0 top-0 bottom-0 m-4 rounded-3xl
       bg-black/10 backdrop-blur-md border border-green-400/60
       shadow-2xl transition-all duration-300 flex flex-col justify-between z-20"
    >
      <div class="absolute inset-0 bg-white/5 blur-3xl rounded-xl"></div>

      <div class="relative z-10">
        <!-- HEADER -->
        <div class="flex items-center justify-between p-6">
          <h1 v-show="open" class="text-2xl font-bold text-white/50 tracking-wider">
            CHAT_WEB
          </h1>

          <!-- Toggle button -->
          <button @click="open = !open" class="text-white/70 cursor-pointer focus:outline-none">
            <component :is="open ? ChevronLeftIcon : ChevronRightIcon" class="w-7 h-7" />
          </button>
        </div>

        <!-- MENU -->
       
          <nav class="mt-10 flex flex-col gap-4 px-3">
              <SidebarItem :icon="HomeIcon" text="Home" to="/" :open="open" active />
              <SidebarItem :icon="UserIcon" text="About" to="/about" :open="open" />
              <SidebarItem :icon="PhoneIcon" text="Contact" to="/contact" :open="open" />
              <SidebarItem :icon="ChatBubbleLeftRightIcon" text="Chats" to="/chat" :open="open" />
              <SidebarItem :icon="ArrowRightOnRectangleIcon" text="Login/Register/Demo" to="/login" :open="open" />
          </nav>
  
      </div>

      <!-- PROFILE -->
      <div class="relative z-10 p-4">
        <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
          <img src="/my-foto.png" class="w-10 h-10 rounded-full" />
          <div v-show="open">
            <h2 class="text-white font-semibold">Fuad Agali</h2>
            <p class="text-gray-400 text-sm">Full STACK DEVELOPER</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- CONTENT -->
   <main
  :class="open ? 'ml-80' : 'ml-28'"
  class="flex-1 p-10 text-white transition-all duration-300 relative"
>
  <h1 class="text-4xl md:text-5xl font-bold">Welcome to Web Chat</h1>
  <p class="mt-4 text-green-400/40 text-lg">
    Connect, chat, and share ideas in real time — wherever you are 🌍
  </p>

  <!-- Chat illustration -->
  <div class="relative mt-10 w-2/3 md:w-1/2 mx-auto rounded-xl shadow-lg overflow-hidden">
    <img
      src="/home_photo.png"
      alt="Chat illustration"
      class="w-full transition-transform duration-300 hover:scale-105"
    />
    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-linear-to-r from-[#0f0f1f]/70 to-transparent"></div>
  </div>

  <!-- Live Chat Preview -->
  <section
    class="mt-6 mx-auto w-[70%] md:w-[60%] lg:w-[50%]
           bg-white/10 backdrop-blur-md rounded-2xl p-4 
           border border-white/20 shadow-lg transition-all duration-300"
  >
    <h2 class="text-lg font-semibold mb-2 text-white">Live Chat Preview</h2>
    <div class="space-y-2 text-sm">
      <div class="flex items-center gap-2">
        <span class="bg-blue-500 text-white px-3 py-1 rounded-2xl">Fuad: Hey everyone 👋</span>
      </div>
      <div class="flex items-center justify-end gap-2">
        <span class="bg-gray-700 text-white px-3 py-1 rounded-2xl">Aylin: Hi Fuad! How’s it going?</span>
      </div>
    </div>
  </section>
</main>
  </div>
</template>






