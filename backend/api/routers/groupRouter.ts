import express from "express";
import * as groupController from "../controllers/groupController.js";
import * as userController from "../controllers/userController.js";
import * as postController from "../controllers/postController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { CreateGroupRequest } from "../models/group/CreateGroupRequest.js";
import AddUserToGroupRequest from "../models/group/AddUserToGroupRequest.js";
import RemoveUserFromGroupRequest from "../models/group/RemoveUserFromGroupRequest.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(400).json({ error: "Failed to fetch groups" });
    return;
  }

  try {
    const groups = await groupController.findAllGroupsForUser(user.id);
    res.json(groups);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch groups" });
  }
});

router.get("/:groupId", authenticateToken, async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(400).json({ error: "Failed to fetch groups" });
    return;
  }

  const groupId: number = Number(req.params.groupId);
  const userGroup = await groupController.findUserGroupByGroupIdAndUserId(
    groupId,
    user.id,
  );
  if (!userGroup) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const group = await groupController.findGroupById(groupId);
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch groups" });
  }
});

router.get("/:groupId/post", authenticateToken, async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(400).json({ error: "Failed to fetch groups" });
    return;
  }

  const groupId: number = Number(req.params.groupId);
  const userGroup = await groupController.findUserGroupByGroupIdAndUserId(
    groupId,
    user.id,
  );
  if (!userGroup) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const groups = await postController.findAllPostsForGroup(groupId);
    res.json(groups);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch groups" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const createGroupRequest = req.body as CreateGroupRequest;

  const user = req.user;
  if (!user) {
    res.status(400).json({ error: "Failed to fetch groups" });
    return;
  }

  try {
    const newGroup = await groupController.createGroup(createGroupRequest);
    await groupController.addUserToGroup(newGroup.id, user.id);
    res.json({ message: "Group created successfully", newGroup: newGroup });
  } catch (error) {
    res.status(400).json({ error: "Failed to create group" });
  }
});

router.post("/user", authenticateToken, async (req, res) => {
  const { groupId, userEmail } = req.body as AddUserToGroupRequest;

  const user = req.user;
  if (!user) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const userGroup = await groupController.findUserGroupByGroupIdAndUserId(
    groupId,
    user.id,
  );
  if (!userGroup) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const userToAdd = await userController.findUserByEmail(userEmail);
  if (!userToAdd) {
    res.status(400).json({ error: "User does not exist" });
    return;
  }

  try {
    await groupController.addUserToGroup(groupId, userToAdd.id);
    res.json({
      message: "User added to group successfully",
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to add user to group" });
  }
});

router.delete("/:groupId/user/:userId", authenticateToken, async (req, res) => {
  const { groupId, userId } = req.params;

  const user = req.user;
  if (!user) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const userGroup = await groupController.findUserGroupByGroupIdAndUserId(
    Number(groupId),
    user.id,
  );
  if (!userGroup) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const userGroupToDelete =
    await groupController.findUserGroupByGroupIdAndUserId(
      Number(groupId),
      Number(userId),
    );
  if (!userGroupToDelete) {
    res.status(400).json({ error: "User is not in group" });
    return;
  }

  try {
    await groupController.deleteUserGroup(userGroupToDelete.id);
    res.json({
      message: "User removed from group successfully",
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to remove user from group " });
  }
});

export default router;
