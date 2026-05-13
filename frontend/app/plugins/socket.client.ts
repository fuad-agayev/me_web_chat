import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const socket = io(config.public.apiBase, {
    withCredentials: true,
    autoConnect: true
  });

  // 🔥 AUTH HATASI OLURSA
  socket.on("connect_error", async (err) => {
    if (err.message === "Unauthorized") {

      // 1️⃣ refresh çağır
      await fetch(`${config.public.apiBase}/api/auth/refresh`, {
        method: "POST",
        credentials: "include"
      });

      // 2️⃣ tekrar bağlan
      socket.connect();
    }
  });

  return {
    provide: {
      socket
    }
  };
});


