export const useApi = () => {
  const config = useRuntimeConfig();

  const request = async <T = any>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    try {
      return await $fetch<T>(`${config.public.apiBase}${url}`, {
        credentials: "include",
        ...options
      });

    } catch (err: any) {

      if (err?.status === 401 && !url.includes("/api/auth/refresh")) {
        try {
          // 🔥 sadece 1 refresh dene
          await $fetch(`${config.public.apiBase}/api/auth/refresh`, {
            method: "POST",
            credentials: "include"
          });

          // 🔁 başarılıysa original request tekrar
          return await $fetch<T>(`${config.public.apiBase}${url}`, {
            credentials: "include",
            ...options
          });

        } catch {
          // ❌ refresh de fail → loop yok
          await navigateTo("/login");
          throw new Error("Refresh failed");
        }
      }

      throw err;
    }
  };

  return { request };
};