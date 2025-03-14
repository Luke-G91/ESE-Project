import { PrismaClient } from "@prisma/client";
import { Comment } from "../models/comment/Comment.js";
import { CreateCommentRequest } from "../models/comment/CreateCommentRequest.js";
import { CommentViewModel } from "../models/comment/CommentViewModel.js";

const prisma = new PrismaClient();

export const findAllCommentsForPost = async (postId: number) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: { select: { name: true } },
    },
  });

  const commentViewModels: CommentViewModel[] = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author: comment.user.name,
  }));

  return commentViewModels;
};

export const createComment = async (
  comment: CreateCommentRequest,
  postId: number,
  userId: number,
) => {
  const newComment: Comment = await prisma.comment.create({
    data: {
      content: comment.content,
      postId: postId,
      userId: userId,
    },
  });

  return newComment;
};
