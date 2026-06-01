<template>
  <div class="min-h-screen bg-linear-to-br from-[#0f0f1f] to-[#1b1b35] text-white p-10">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">About Chat_Web</h1>
    <p class="text-gray-300 text-lg mb-8">
      Chat_Web is a full-stack real-time messaging project. It supports private 1-to-1 chats, group chats, and global chats.
      Built with Nuxt 4 (server-side Vue.js framework), Vue 3, Tailwind CSS, and TypeScript on the frontend, deployed on Vercel. 
      Backend is powered by Node.js & Express, with PostgreSQL database hosted on Neon. For production we used Render and Railway,
      and Cloudinary for storage. Both frontend and backend include unit and integration testing.
    </p>

    <!-- Features -->
    <section class="grid md:grid-cols-3 gap-8">
      <div class="bg-white/5 rounded-2xl p-6 shadow-xl text-center">
        <img src="/private_avatar.png" alt="Private Chat" class="w-16 h-16 mx-auto mb-4" />
        <h2 class="text-xl font-semibold mb-2">Private Chat</h2>
        <p class="text-gray-400">Secure 1-to-1 messaging with end-to-end encryption.</p>
      </div>
      <div class="bg-white/5 rounded-2xl p-6 shadow-xl text-center">
        <img src="/group_avatar.png" alt="Group Chat" class="w-16 h-16 mx-auto mb-4" />
        <h2 class="text-xl font-semibold mb-2">Group Chat</h2>
        <p class="text-gray-400">Collaborate with multiple users in shared rooms.</p>
      </div>
      <div class="bg-white/5 rounded-2xl p-6 shadow-xl text-center">
        <img src="/global_avatar.png" alt="Global Chat" class="w-16 h-16 mx-auto mb-4" />
        <h2 class="text-xl font-semibold mb-2">Global Chat</h2>
        <p class="text-gray-400">Join the worldwide chat stream and connect instantly.</p>
      </div>
    </section>

    <!-- Tech Stack -->
    <section class="mt-12 grid md:grid-cols-2 gap-8">
      <div class="bg-white/5 rounded-2xl p-6 shadow-xl">
        <h2 class="text-2xl font-semibold mb-4">Frontend</h2>
        <ul class="list-disc list-inside text-gray-400">
          <li>Nuxt 4 & Vue 3</li>
          <li>Tailwind CSS & TypeScript</li>
          <li>Deployed on Vercel</li>
          <li>Unit testing with Jest & Vue Test Utils</li>
        </ul>
      </div>
      <div class="bg-white/5 rounded-2xl p-6 shadow-xl">
        <h2 class="text-2xl font-semibold mb-4">Backend</h2>
        <ul class="list-disc list-inside text-gray-400">
          <li>Node.js & Express</li>
          <li>Socket.io for real-time communication</li>
          <li>PostgreSQL database (Neon)</li>
          <li>Render & Railway for production</li>
          <li>Cloudinary for storage</li>
          <li>Integration testing with Jest & Supertest</li>
        </ul>
      </div>
    </section>
    <!-- Back Link -->
      <NuxtLink 
        to="/" 
        class="mt-12 inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl shadow-lg transition"
      >
        ← Back to Home
      </NuxtLink>
  </div>
</template>




