import { useApi } from "~/composables/refreshApi";

export const useAuth = () => {
  const config = useRuntimeConfig();
   const { request } = useApi();

  interface RegisterData {
    username?: string;
    email: string;
    password: string;
  }

  interface User {
    id: number;
    username: string;
    email: string;
  }

  const user = useState<User | null>("user", () => null);
 

  // --------------  Sign up --------------//
  const register = async (data: RegisterData): Promise<User> => {
    return await $fetch<User>(`${config.public.apiBase}/api/auth/register`, {
      method: "POST",
      body: data
    });
  };
// -------------- Sign up --------------//


// -------------- Profile --------------//
const fetchProfile = async () => {
    const res = await request("/api/auth/profile");
    user.value = res;
  };
// -------------- Profile --------------//


// --------------  Login--------------//
  const login = async (data: RegisterData) => {
    const res = await $fetch<User>(`${config.public.apiBase}/api/auth/login`, {
      method: "POST",
      body: data,
      credentials: "include"
    });

    // ⚠️ optional: sadece UI için
    user.value = res;

    return res;
  };
// --------------  Login--------------//


//* -----------------------------  Logout ------------------------------//
const logout = async () => {
    await $fetch(`${config.public.apiBase}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    });

    user.value = null;

    navigateTo("/login");
  };
//* -----------------------------  Logout ------------------------------//


  return { user, register, login, logout, fetchProfile };
};