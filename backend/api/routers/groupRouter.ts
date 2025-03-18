import express from "express";
import * as groupController from "../controllers/groupController.js";
import * as userController from "../controllers/userController.js";
import * as postController from "../controllers/postController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { CreateGroupRequest } from "../models/group/CreateGroupRequest.js";
import AddUserToGroupRequest from "../models/group/AddUserToGroupRequest.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
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
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // as the id is a query parameter it is a string
  // however it is needed as a number
  const groupId = Number(req.params.groupId);
  if (!groupId) {
    res.status(400).json({ error: "Failed to fetch group" });
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
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // as the id is a query parameter it is a string
  // however it is needed as a number
  const groupId = Number(req.params.groupId);
  const userGroup = await groupController.findUserGroupByGroupIdAndUserId(
    groupId,
    user.id,
  );
  if (!userGroup) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const groups = await postController.findAllPostsForGroup(groupId, user.id);
    res.json(groups);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch groups" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const createGroupRequest = req.body as CreateGroupRequest;

  const user = req.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
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

router.post("/:groupId/user", authenticateToken, async (req, res) => {
  const { userEmail } = req.body as AddUserToGroupRequest;

  // as the id is a query parameter it is a string
  // however it is needed as a number
  const groupId = Number(req.params.groupId);
  if (!groupId) {
    res.status(400).json({ error: "Group does not exist" });
    return;
  }

  const user = req.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
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
  // as the ids are query parameters they are strings
  // however they are needed as numbers
  const groupId = Number(req.params.groupId);
  const userIdToDelete = Number(req.params.userId);

  const user = req.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
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

  const userGroupToDelete =
    await groupController.findUserGroupByGroupIdAndUserId(
      groupId,
      userIdToDelete,
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
    res.status(400).json({ error: "Failed to remove user from group" });
  }
});

export default router;
