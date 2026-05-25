export interface DemoUser {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface DemoResponse {
  user: DemoUser;
}

export const loginDemo =
  async (): Promise<DemoResponse> => {

    const res = await fetch(
      "/api/demo",
      {
        method: "POST",

        credentials: "include"
      }
    );

    if (!res.ok) {
      throw new Error(
        "Demo login failed"
      );
    }

    return await res.json();
};