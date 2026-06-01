<template>
  <NuxtLink
    :to="to"
    class="relative group flex items-center h-14 rounded-lg cursor-pointer transition-all duration-300"
    :class="[
      open ? 'justify-start px-5' : 'justify-center',
      active
        ? 'bg-white/20 border-2 border-white/30 text-white/40'
        : 'text-white/60 hover:border-white/70 hover:text-white/70 border-2 border-transparent'
    ]"
  >
    <!-- ICON -->
    <component :is="icon" class="w-6 h-6 text-green-400/50 hover:text-white/70 " />

    <!-- TEXT -->
    <span v-show="open" class="ml-4 text-lg font-medium whitespace-nowrap text-white/80">
      {{ text }}
    </span>

    <!-- TOOLTIP -->
    <div
      v-if="!open"
      class="absolute left-24 top-1/2 -translate-y-1/2 opacity-0 invisible
             group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
             
    >
      <div class=" text-white px-5 py-2 rounded-xl shadow-2xl whitespace-nowrap rouned-lg border border-green-400/50 backdrop-blur-md">
        {{ text }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  icon: [Object, Function],
  text: String,
  to: String,
  open: Boolean,
  active: Boolean
})
</script>
