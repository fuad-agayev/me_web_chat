<template>
  <div class="flex flex-col items-center justify-center h-screen 
              bg-linear-to-br from-[#0f172a] via-[#504c2d] to-[#3b3913] 
              text-white space-y-10">
    
    <!-- Image -->
    <img src="../err.png" alt="404 Error" 
         class="w-64 h-64 object-contain drop-shadow-2xl animate-pulse" />

    <!-- Title -->
    <h1 class="text-7xl font-extrabold text-transparent bg-clip-text 
               bg-linear-to-r from-zinc-700 via-zinc-600 to-zinc-700 
               drop-shadow-lg tracking-widest animate-pulse">
      404
    </h1>

    <!-- Subtitle -->
    <h2 class="text-2xl font-semibold text-gray-200">
      Oops! not found
    </h2>

    

    <!-- Back Home Button -->
    <NuxtLink
      to="/"
      class="px-8 py-3 rounded-lg bg-linear-to-r from-zinc-600 to-zinc-700 
             text-white font-bold shadow-xl 
             transition-transform duration-300 ease-in-out flex items-center space-x-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span> Let's back </span>
    </NuxtLink>
  </div>
</template>






