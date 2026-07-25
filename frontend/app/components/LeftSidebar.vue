<template>
  <aside 
    class="fixed bottom-0 left-0 w-full md:relative md:w-20 md:h-[80vh] md:my-auto md:rounded-2xl 
           flex md:flex-col items-center justify-between py-3 md:py-6 px-2 md:px-0 z-50
           bg-black/40 md:bg-zinc-900/40 border-t md:border md:border-white/40 
           shadow-2xl transition-all duration-300"
  >
    <div class="hidden md:flex w-12 h-12 items-center justify-center border border-zinc-400 rounded-xl mb-4 hover:bg-[#e6e7a9]">
      <h4 class="font-bold text-zinc-500 tracking-wide">FA</h4>
    </div>

    <nav class="flex md:flex-col w-full md:w-auto justify-around md:justify-center md:space-y-6">
      <NuxtLink to="/" class="group w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all hover:bg-[#e6e7a9]">
        <HomeIcon class="w-5 h-5 text-white/70 group-hover:text-[#7d7e5c] transition-colors" />
      </NuxtLink>

      <NuxtLink to="/chat" class="group w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all hover:bg-[#e6e7a9]">
        <ChatBubbleLeftRightIcon class="w-5 h-5 text-white/70 group-hover:text-[#8c8d63] transition-colors" />
      </NuxtLink>

      <NuxtLink to="/login" class="group w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all hover:bg-[#e6e7a9]">
        <UserIcon class="w-5 h-5 text-white/70 group-hover:text-[#92926e] transition-colors" />
      </NuxtLink>

      <NuxtLink to="/contact" class="group w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all hover:bg-[#e6e7a9]">
        <IdentificationIcon class="w-5 h-5 text-white/70 group-hover:text-[#8b8b5a] transition-colors" />
      </NuxtLink>
    </nav>

    <div class="hidden md:flex flex-col items-center">
      <NuxtLink to="/" class="w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center transition-all hover:bg-[#e6e7a9]">
        <Cog6ToothIcon class="w-5 h-5 text-white/50 hover:text-[#bec064] hover:rotate-90 transition-all" />
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { HomeIcon, UserIcon, ChatBubbleLeftRightIcon, IdentificationIcon, Cog6ToothIcon } from "@heroicons/vue/24/outline";
</script>