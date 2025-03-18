import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPostLike = async (postId: number, userId: number) => {
  const newLike = await prisma.postLike.create({
    data: {
      postId: postId,
      userId: userId,
    },
  });

  return newLike;
};

export const deletePostLike = async (postId: number, userId: number) => {
  return await prisma.postLike.delete({
    where: {
      // unique key on postLike
      userId_postId: {
        userId: userId,
        postId: postId,
      },
    },
  });
};
