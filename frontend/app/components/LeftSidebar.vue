

<template>
  <div class="my-auto">
    <!-- LEFT SIDEBAR -->
    <aside class="w-16 h-[80vh] my-auto rounded-xl flex flex-col items-center justify-between py-4 
                   bg-linear-to-t from-zinc-400 via-[#a7a374] to-zinc-500  shadow-lg shadow-zinc-700/70">
      
      <!-- Logo -->
      <div class="w-12 h-12 flex items-center justify-center border-2 border-zinc-900 px-4 font-semibold 
            shadow-lg shadow-zinc-700/70 rounded-md hover:scale-105 transition-transform">
        <h4 class="font-bold text-zinc-700 tracking-wide">FA</h4>
      </div>

      <!-- Navigation -->
      <nav class="space-y-6">
        <!-- Home -->
        <NuxtLink 
  to="/" 
  class="relative group w-14 h-14 rounded flex items-center justify-center transition-all shadow-md hover:bg-black/50"
>
  <HomeIcon class="w-6 h-6 text-gray-900 group-hover:text-white" />
  <span 
    class="absolute left-full ml-2 top-1/2 -translate-y-1/2 
           px-2 py-1 rounded bg-transparent text-zinc-100 text-md border border-zinc-500 
           opacity-0 group-hover:opacity-100 transition-opacity w-auto"
  >
    Home
  </span>
</NuxtLink>

<!-- Chat -->
<NuxtLink 
  to="/chat" 
  class="relative group w-14 h-14 rounded flex items-center justify-center transition-all shadow-md hover:bg-black/50"
>
  <ChatBubbleLeftRightIcon class="w-6 h-6 text-gray-900 group-hover:text-white" />
  <span 
    class="absolute left-full ml-2 top-1/2 -translate-y-1/2 
           px-2 py-1 rounded bg-transparent text-zinc-100 text-md border border-zinc-500 
           opacity-0 group-hover:opacity-100 transition-opacity w-auto"
  >
    Chat
  </span>
</NuxtLink>

<!-- Login -->
<NuxtLink 
  to="/login" 
  class="relative group w-14 h-14 rounded flex items-center justify-center transition-all shadow-md hover:bg-black/50"
>
  <UserIcon class="w-6 h-6 text-gray-900 group-hover:text-white" />
  <span 
    class="absolute left-full ml-2 top-1/2 -translate-y-1/2 
           px-2 py-1 rounded bg-transparent text-zinc-100 text-md border border-zinc-500 
           opacity-0 group-hover:opacity-100 transition-opacity w-auto"
  >
    Login
  </span>
</NuxtLink>

<!-- Contact -->
<NuxtLink 
  to="/contact" 
  class="relative group w-14 h-14 rounded flex items-center justify-center transition-all shadow-md hover:bg-black/50"
>
  <IdentificationIcon class="w-6 h-6 text-gray-900 group-hover:text-white" />
  <span 
    class="absolute left-full ml-2 top-1/2 -translate-y-1/2 
           px-2 py-1 rounded bg-transparent text-zinc-100 text-md border border-zinc-500 
           opacity-0 group-hover:opacity-100 transition-opacity w-auto"
  >
    Contact
  </span>
</NuxtLink>
      </nav>

      <!-- Bottom Section -->
<div class="flex flex-col items-center space-y-4">
  <!-- Avatar -->
  
  <!-- Settings -->

  
       <NuxtLink 
    to="/settings" 
    class="relative group w-14 h-14 rounded border-2 border-zinc-800 shadow-zinc-700/70 flex items-center justify-center transition-all shadow-md hover:bg-black/50"
  >
    <Cog6ToothIcon class="w-6 h-6 text-gray-900 group-hover:text-white hover:rotate-90 transition-transform" />
    <span 
      class="absolute left-full ml-2 top-1/2 -translate-y-1/2 
             px-2 py-1 rounded bg-transparent text-zinc-50 text-sm border border-zinc-500 
             opacity-0 group-hover:opacity-100 transition-opacity w-auto"
    >
      Settings
    </span>
  </NuxtLink>
      
  
</div>


    </aside>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon, UserIcon, ChatBubbleLeftRightIcon, IdentificationIcon, Cog6ToothIcon } from "@heroicons/vue/24/outline";
</script>






