// middleware/auth.ts
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchProfile } = useAuth();

  // Eğer kullanıcı zaten yüklüyse tekrar çağırma
  if (user.value) {
    return;
  }

  try {
    await fetchProfile(); // 👈 sadece burada çağır
  } catch (err) {
    console.error("Auth middleware error:", err);
       return navigateTo("/login");
  }
});





