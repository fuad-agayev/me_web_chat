import { useApi } from '~/composables/refreshApi';

export const useUsers = () => {
  const { request } = useApi();

  interface Users {
    id: number;
    username: string;
  }

  const users = useState<Users[]>("users", () => []);

  const fetchUsers = async () => {
    const res = await request<Users[]>("/api/users");
    users.value = res as Users[];
  };

  return { users, fetchUsers };
};

// !  REFRESH olamdan eski normal durum ile bu da islerdi ancak sonraki durmda hata alir Kullanici
// export const useUsers = () => {
//   const config = useRuntimeConfig();

//   interface User {
//     id: number,
//     username: string
//   }

//   const users = useState<User[]>("users", () => []);

//   const fetchUsers = async () => {
//     const res = await $fetch<User[]>(`${config.public.apiBase}/api/users`, {
//       method: "GET",
//       credentials: "include"
//     });

//     users.value = res;
//   };

//   return { users, fetchUsers };
// };