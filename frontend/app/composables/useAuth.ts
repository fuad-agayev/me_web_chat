import { useApi } from "~/composables/refreshApi";

export const useAuth = () => {
  const config = useRuntimeConfig();
   const { request } = useApi();

  interface RegisterData {
  username?: string;
  email: string;
  password: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  latitude?: number | null;
  longitude?: number | null;
  google_id?: string;
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
// const fetchProfile = async () => {
//     const res = await request<User>("/api/auth/profile");
//      console.log("PROFILE RESPONSE:", res);
//     user.value = res;
//   };

  // -------------- Profile --------------//
const fetchProfile = async () => {
  try {
    const res = await request<User>("/api/auth/profile", {
      // ekstra header görmek için
      headers: { "Accept": "application/json" },
       credentials: "include"
    });

    console.log("✅ PROFILE RESPONSE:", res);
    user.value = res;
    return res;
  } catch (err: any) {
    console.error("❌ PROFILE ERROR:", err);
    // hata kodunu da logla
    if (err?.status) {
      console.error("Status code:", err.status);
    }
    throw err;
  }
};



//   const fetchProfile = async () => {
//   const res = await request<User>("/api/auth/profile");
//   //const serverUrl = useRuntimeConfig().public.apiBase; // məsələn http://localhost:5000
//   user.value = {
//     ...res,
//     avatar: res.avatar ? `${config.public.apiBase}${res.avatar}` : null
//   };
// };


// -------------- Profile --------------//


// --------------  Login--------------//
  const login = async (data: RegisterData) => {
    const res = await $fetch<User>(`${config.public.apiBase}/api/auth/login`, {
      method: "POST",
      body: data,
      credentials: "include"
    });

    // ⚠️ optional: sadece UI için
    //user.value = res;
await fetchProfile(); // profil məlumatını yenilə
  return res;
  
  };
// --------------  Login--------------//


// --------------  with google --------------//

const loginWithGoogle = () => {
  window.location.href = `${config.public.apiBase}/api/auth/google`;
};


// -------------- with  google  --------------//



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


//* -----------------------------  get Location ------------------------------//

const updateLocation = async (
  latitude: number,
  longitude: number
) => {
  return await $fetch(`${config.public.apiBase}/api/users/location`, {
    method: "PATCH",
    credentials: "include",
    body: {
      latitude,
      longitude
    }
  });
};
//* -----------------------------  get Location ------------------------------//


  return { user, register, login, logout, fetchProfile, loginWithGoogle, updateLocation };
};