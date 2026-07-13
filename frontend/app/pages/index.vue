<template>
  <div class="">
    
    <!-- Normal içerik -->
    <div class="flex h-screen bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-800 overflow-hidden">
      <LeftSidebar class="ml-4"/>
      <main class="flex-1 flex flex-col items-center justify-center border-r border-r-zinc-800 mx-24 my-24 space-y-8 px-6">
        <h2 class="text-3xl font-extrabold bg-linear-to-t from-zinc-300 to-zinc-500 
                   bg-clip-text text-transparent drop-shadow-md text-center">
          WELCOME WEB CHATTING <br /> FA APPLICATION
        </h2>
        <p class="text-base font-bold lg:text-lg max-w-lg text-center leading-relaxed 
                   bg-linear-to-t from-[#2c2c14] to-[#fcfa7a] bg-clip-text text-transparent">
          This Web Chat helps us to communicate and stay connected in a simple, modern way.
        </p>
        <div class="w-40 h-40 flex items-center justify-center rounded-lg shadow-2xl">
          <img src="/fa-chat.png" alt="FA-image" 
               class="w-full h-full object-contain drop-shadow-xl filter invert" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

import LeftSidebar from "~/components/LeftSidebar.vue"

</script>





