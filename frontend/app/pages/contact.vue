<template>
  <div class="min-h-screen bg-linear-to-br from-[#0f0f1f] to-[#1b1b35] flex items-center justify-center text-white p-10">
    <div class="max-w-2xl w-full text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
      <p class="text-gray-300 text-lg mb-12">
        Have questions or feedback? Get in touch with me below.
      </p>

      <!-- Contact Cards -->
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Email -->
        <div class="bg-white/5 rounded-2xl p-6 shadow-xl flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m0 0l4-4m-4 4l4 4" />
          </svg>
          <h2 class="text-xl font-semibold mb-2">Email</h2>
          <p class="text-gray-400">fuad0000010@gmail.com</p>
        </div>

        <!-- Phone -->
        <div class="bg-white/5 rounded-2xl p-6 shadow-xl flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h2l3 7v5h8v-5l3-7h2" />
          </svg>
          <h2 class="text-xl font-semibold mb-2">Phone</h2>
          <p class="text-gray-400">+994 55 700 14 02</p>
        </div>

        <!-- GitHub -->
        <div class="bg-white/5 rounded-2xl p-6 shadow-xl flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.77.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 013 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <h2 class="text-xl font-semibold mb-2">GitHub</h2>
          <p class="text-gray-400">
  <a 
    href="https://github.com/fuad-agayev" 
    target="_blank" 
    rel="noopener noreferrer" 
    class="hover:text-blue-400 underline"
  >
    github.com/fuad-agayev
  </a>
</p>

        </div>
      </div>

      <!-- Back Link -->
      <NuxtLink 
        to="/" 
        class="mt-12 inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl shadow-lg transition"
      >
        ← Back to Home
      </NuxtLink>
    </div>
  </div>
</template>


