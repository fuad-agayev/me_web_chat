import { useAuth } from '../composables/useAuth'
export default defineNuxtRouteMiddleware(async () => {
  const { fetchProfile } = useAuth();

  try {
    await fetchProfile(); // 👈 hem kontrol hem data
  } catch {
    return navigateTo("/login");
  }
});


