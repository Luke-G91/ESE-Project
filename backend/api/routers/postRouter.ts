import express from "express";
import * as postController from "../controllers/postController.js";
import * as groupController from "../controllers/groupController.js";
import * as postLikeController from "../controllers/postLikeController.js";
import { CreatePostRequest } from "../models/post/CreatePostRequest.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const posts = await postController.findAllPostsForUser(user.id);
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch posts" });
  }
});

router.get("/:postId", authenticateToken, async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const postId = Number(req.params.postId);
  if (!postId) {
    res.status(400).json({ error: "Failed to get comments" });
    return;
  }

  const post = await postController.findPostById(postId);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const group = await groupController.findGroupById(post.chatGroupId);
  const userIsInGroup = group?.users.some(
    (groupUser) => groupUser.id === user.id,
  );
  if (!userIsInGroup) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const postDetails = await postController.findPostDetailsById(
      post.id,
      user.id,
    );
    res.json(postDetails);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to get post details" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const createPostRequest = req.body as CreatePostRequest;

  const user = req.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userGroup = await groupController.findUserGroupByGroupIdAndUserId(
    createPostRequest.groupId,
    user.id,
  );
  if (!userGroup) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const newPost = await postController.createPost(createPostRequest, user.id);
    res.json({ message: "Post created successfully", newPost });
  } catch (error) {
    res.status(400).json({ error: "Failed to create post" });
  }
});

router.post("/:postId/like", authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await postLikeController.createPostLike(Number(postId), user.id);
    res.json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to like post" });
  }
});

router.delete("/:postId/like", authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await postLikeController.deletePostLike(Number(postId), user.id);
    res.json({ message: "Post liked removed successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to remove like from post" });
  }
});

export default router;
