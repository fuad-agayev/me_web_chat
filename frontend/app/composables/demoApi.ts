export interface DemoUser {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface DemoResponse {
  user: DemoUser;
}

export const loginDemo = async (): Promise<DemoResponse> => {
  const config = useRuntimeConfig();

  const res = await $fetch<DemoResponse>(`${config.public.apiBase}/api/demo`, {
    method: "POST",
    credentials: "include"
  });

  return res;
};
