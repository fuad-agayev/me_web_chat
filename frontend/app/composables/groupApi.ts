
import { useApi } from "~/composables/refreshApi";

const BASE_URL = "/api/groups";

export interface Group {
  id: number;
  name: string;
  created_by: number;
  created_at: string;
}

export interface GroupMessage {
  id: number;
  group_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  username?: string;
  avatar?: string;
  edited?: boolean;
  deleted?: boolean;
}

export const useGroupApi = () => {

  const { request } = useApi();

  const getMyGroups =
    async (): Promise<Group[]> => {

      return await request<Group[]>(
        BASE_URL
      );
    };

  const getGroupMessages = async (
    groupId: number
  ): Promise<GroupMessage[]> => {

    return await request<GroupMessage[]>(
      `${BASE_URL}/${groupId}/messages`
    );
  };

  const createGroup = async (
    name: string
  ): Promise<Group> => {

    return await request<Group>(
      BASE_URL,
      {
        method: "POST",

        body: {
          name
        }
      }
    );
  };

  return {
    getMyGroups,
    getGroupMessages,
    createGroup
  };
};