import axios from "axios";
import { GroupViewModel } from "./models/group/ViewGroupModel";
import { GroupDetails } from "./models/group/GroupDetails";
import { CreateGroupRequest } from "./models/group/CreateGroupRequest";

const baseUrl = import.meta.env.VITE_API_URL;

export const getAllGroups = async (): Promise<GroupViewModel[]> => {
  const response = await axios.get(`${baseUrl}/group`, {
    withCredentials: true,
  });
  return response.data;
};

export const createGroup = async (
  groupData: CreateGroupRequest,
): Promise<GroupViewModel> => {
  const response = await axios.post(`${baseUrl}/group`, groupData, {
    withCredentials: true,
  });
  return response.data;
};

export const getGroup = async (groupId: number): Promise<GroupDetails> => {
  const response = await axios.get(`${baseUrl}/group/${groupId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const addUserToGroup = async (groupId: number, email: string) => {
  await axios.post(
    `${baseUrl}/group/${groupId}/user`,
    { userEmail: email },
    {
      withCredentials: true,
    },
  );
};

export const deleteUserFromGroup = async (groupId: number, userId: number) => {
  await axios.delete(`${baseUrl}/group/${groupId}/user/${userId}`, {
    withCredentials: true,
  });
};
