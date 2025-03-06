import express from "express";
import * as postController from "../controllers/postController.js";
import * as groupController from "../controllers/groupController.js";
import { CreatePostRequest } from "../models/post/CreatePostRequest.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(400).json({ error: "Failed to fetch posts" });
    return;
  }

  try {
    const posts = await postController.findAllPostsForUser(user.id);
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch posts" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const createPostRequest = req.body as CreatePostRequest;

  const user = req.user;
  if (!user) {
    res.status(400).json({ error: "Failed to create post" });
    return;
  }

  const userGroup = await groupController.findUserGroupByGroupIdAndUserId(
    createPostRequest.groupId,
    user.id,
  );
  if (!userGroup) {
    res.status(400).json({ error: "User is not in group" });
    return;
  }

  try {
    const newPost = await postController.createPost(createPostRequest, user.id);
    res.json({ message: "Post created successfully", newPost });
  } catch (error) {
    res.status(400).json({ error: "Failed to create post" });
  }
});

export default router;
