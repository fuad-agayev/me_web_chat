<template>
  <div class="flex flex-col items-center justify-center h-screen bg-zinc-800 text-white space-y-8">
    <!-- Başlık -->
    <h2 class="text-3xl font-bold bg-linear-to-r from-zinc-400 via-[#f8f2bc] to-100% bg-clip-text text-transparent">
      HIRE ME..!
    </h2>

    <!-- Açıklama -->
    <p class="bg-linear-to-t from-[#2c2c28] to-[#f8f8f3] bg-clip-text text-transparent max-w-md text-center leading-relaxed">
      You can reach me anytime via email and phone number or  chat for support and collaboration.
    </p>

    <!-- İletişim Bilgileri -->
    <div class="space-y-4 text-center">
    <!-- Phone -->
    <p class="text-lg font-semibold flex items-center justify-center space-x-2">
      <PhoneIcon class="w-6 h-6 text-white/50" />
      <a href="tel:+994557001402" class="bg-linear-to-r from-zinc-400 to-zinc-700 bg-clip-text text-transparent hover:underline">+994 55 700 14 02</a>
    </p>

    <!-- Email -->
    <p class="text-lg font-semibold flex items-center justify-center space-x-2">
      <EnvelopeIcon class="w-6 h-6 text-white/50" />
      <a href="mailto:fuad0000010@gmail.com" class="bg-linear-to-r from-zinc-400 via-[#9e9967] bg-clip-text text-transparent hover:underline">fuad0000010@gmail.com</a>
    </p>
  </div>

    <!-- Harita -->
    <div class="w-full max-w-xl h-64 rounded-lg overflow-hidden shadow-lg border-2 border-zinc-700">
     <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48633.649002384635!2d49.858278833683485!3d40.
     37301315735348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku!5e0!3m2!1sen!2saz!4v1782224030323!5m2!1sen!2saz"
      width="600" height="450" style="border:0;"
     loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
       
    </div>

   <!-- Back Home Button -->
<!-- Back Home Button -->
<NuxtLink 
  to="/" 
  class="flex items-center space-x-2 px-4 py-2 rounded-lg 
         bg-linear-to-r from-zinc-400 via-[#f8f2bc] to-100% 
         hover:bg-zinc-400 hover:text-white transition-all shadow-md"
>
  <ChevronLeftIcon class="w-5 h-5 text-zinc-700" />
  <span class="text-zinc-700 font-semibold">Back Home</span>
</NuxtLink>

  </div>
</template>

<script setup lang="ts">
import {ChevronLeftIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/vue/24/outline";
</script>



