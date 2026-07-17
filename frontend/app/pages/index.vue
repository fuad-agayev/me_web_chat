<template>
  <div class="h-screen w-full bg-linear-to-r from-zinc-700 via-zinc-700 to-zinc-800 overflow-hidden flex flex-col md:flex-row">
    
    <LeftSidebar />

    <main class="flex-1 flex flex-col items-center justify-center p-6 md:px-24 pb-24 md:pb-24 space-y-6 md:space-y-8 overflow-y-auto">
      
      <h2 class="text-2xl md:text-3xl font-extrabold bg-linear-to-t from-zinc-300 to-zinc-500 bg-clip-text text-transparent drop-shadow-md text-center leading-tight">
        WELCOME WEB CHATTING <br /> FA APPLICATION
      </h2>
      
      <p class="text-sm md:text-base font-bold lg:text-lg max-w-md md:max-w-lg text-center leading-relaxed bg-linear-to-t from-[#72724a] to-[#ececb0] bg-clip-text text-transparent">
        This Web Chat helps us to communicate and stay connected in a simple, modern way.
      </p>

      <div class="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-lg shadow-2xl">
        <img 
          src="/fa-chat.png" 
          alt="FA-image" 
          class="w-full h-full object-contain drop-shadow-xl filter invert" 
        />
      </div>
      
    </main>
  </div>
</template>

<script setup lang="ts">
import LeftSidebar from "~/components/LeftSidebar.vue"
</script>





