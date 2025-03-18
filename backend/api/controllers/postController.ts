import { PrismaClient } from "@prisma/client";
import { CreatePostRequest } from "../models/post/CreatePostRequest.js";
import { Post } from "../models/post/Post.js";
import { PostViewModel } from "../models/post/PostViewModel.js";
import { PostDetails } from "../models/post/PostDetails.js";

const prisma = new PrismaClient();

export const findAllPosts = async () => {
  const posts: Post[] = await prisma.post.findMany();
  return posts;
};

export const findPostById = async (id: number) => {
  const post: Post | null = await prisma.post.findFirst({ where: { id } });
  return post;
};

export const findPostDetailsById = async (id: number, userId: number) => {
  const post = await prisma.post.findFirst({
    where: {
      id,
    },
    include: {
      author: {
        select: { name: true },
      },
      chatGroup: {
        select: { name: true },
      },
      _count: {
        select: { PostLike: true },
      },
      // PostLikes from current user
      PostLike: {
        where: { userId },
        select: { id: true },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!post) {
    return null;
  }

  const postDetails: PostDetails = {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    author: post.author.name,
    group: post.chatGroup.name,
    likeCount: post._count.PostLike,
    // post.PostLike is filtered to current user
    likedByCurrentUser: post.PostLike.length > 0,
    comments: post.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: comment.user.name,
    })),
  };

  return postDetails;
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

export const findAllPostsByUserId = async (userId: number) => {
  return await prisma.post.findMany({
    where: { authorId: userId },
  });
};

export const findAllPostsForGroup = async (groupId: number, userId: number) => {
  const posts = await prisma.post.findMany({
    where: {
      chatGroupId: groupId,
    },
    include: {
      author: {
        select: { name: true },
      },
      chatGroup: {
        select: { name: true },
      },
      _count: {
        select: { PostLike: true },
      },
      // PostLikes from current user
      PostLike: {
        where: { userId },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const postViewModels: PostViewModel[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    author: post.author.name,
    group: post.chatGroup.name,
    likeCount: post._count.PostLike,
    // post.PostLike is filtered to current user
    likedByCurrentUser: post.PostLike.length > 0,
  }));

  return postViewModels;
};

export const findAllPostsForUser = async (userId: number) => {
  const userGroups = await prisma.userChatGroup.findMany({
    where: { userId },
    select: { chatGroupId: true },
  });

  const groupIds = userGroups.map((userGroup) => userGroup.chatGroupId);

  if (groupIds.length === 0) return [];

  const posts = await prisma.post.findMany({
    where: {
      chatGroupId: { in: groupIds },
    },
    include: {
      author: {
        select: { name: true },
      },
      chatGroup: {
        select: { name: true },
      },
      _count: {
        select: { PostLike: true },
      },
      // PostLikes from current user
      PostLike: {
        where: { userId },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const postViewModels: PostViewModel[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    author: post.author.name,
    group: post.chatGroup.name,
    likeCount: post._count.PostLike,
    // post.PostLike is filtered to current user
    likedByCurrentUser: post.PostLike.length > 0,
  }));

  return postViewModels;
};
