import { PrismaClient } from "@prisma/client";
import { CreatePostRequest } from "../models/post/CreatePostRequest.js";
import { Post } from "../models/post/Post.js";

const prisma = new PrismaClient();

export const findAllPosts = async () => {
  const posts: Post[] = await prisma.post.findMany();
  return posts;
};

export const createPost = async (post: CreatePostRequest, authorId: number) => {
  const newPost: Post = await prisma.post.create({
    data: {
      title: post.title,
      content: post.content,
      chatGroupId: post.groupId,
      authorId: authorId,
    },
  });

  return newPost;
};

export const findAllPostsForUser = async (userId: number) => {
  return await prisma.post.findMany({
    where: { authorId: userId },
  });
};

export const findAllPostsForGroup = async (groupId: number) => {
  return await prisma.post.findMany({
    where: { chatGroupId: groupId },
  });
};
