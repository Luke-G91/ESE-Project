import { PrismaClient } from "@prisma/client";
import { CreateGroupRequest } from "../models/group/CreateGroupRequest.js";
import { Group } from "../models/group/Group.js";

const prisma = new PrismaClient();

export const findAllGroupsForUser = async (userId: number) => {
  const groups = await prisma.chatGroup.findMany({
    where: {
      userChatGroups: {
        some: {
          userId: userId,
        },
      },
    },
  });

  return groups;
};

export const createGroup = async (group: CreateGroupRequest) => {
  const newGroup: Group = await prisma.chatGroup.create({
    data: { name: group.name, description: group.description },
  });

  return newGroup;
};

export const addUserToGroup = async (groupId: number, userId: number) => {
  const newUserGroup = await prisma.userChatGroup.create({
    data: { chatGroupId: groupId, userId: userId },
  });

  return newUserGroup;
};

export const findUserGroupByGroupIdAndUserId = async (
  groupId: number,
  userId: number,
) => {
  const userGroupToDelete = await prisma.userChatGroup.findFirst({
    where: { chatGroupId: groupId, userId: userId },
  });

  return userGroupToDelete;
};

export const deleteUserGroup = async (id: number) => {
  await prisma.userChatGroup.delete({
    where: { id: id },
  });
};
