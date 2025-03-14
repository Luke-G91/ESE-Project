import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { CreateCommentRequest } from "../models/comment/CreateCommentRequest.js";
import * as postController from "../controllers/postController.js";
import * as groupController from "../controllers/groupController.js";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.get("/:postId/comment", authenticateToken, async (req, res) => {
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
    const comments = await commentController.findAllCommentsForPost(post.id);
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to get comments" });
  }
});

router.post("/:postId/comment", authenticateToken, async (req, res) => {
  const createCommentRequest = req.body as CreateCommentRequest;

  const user = req.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const postId = Number(req.params.postId);
  if (!postId) {
    res.status(400).json({ error: "Failed to create comment" });
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
    const newComment = await commentController.createComment(
      createCommentRequest,
      post.id,
      user.id,
    );
    res.json({ message: "Comment created successfully", newComment });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to create comment" });
  }
});

export default router;
