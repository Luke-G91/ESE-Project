import axios from "axios";
import CreatePostRequest from "./models/post/CreatePostRequest";
import { PostViewModel } from "./models/post/PostViewModel";

const baseUrl = import.meta.env.VITE_API_URL;

export const getAllPosts = async (): Promise<PostViewModel[]> => {
  const response = await axios.get(`${baseUrl}/post`, {
    withCredentials: true,
  });
  return response.data;
};

export const createPost = async (newPostRequest: CreatePostRequest) => {
  const response = await axios.post(`${baseUrl}/post`, newPostRequest, {
    withCredentials: true,
  });
  return response.data;
};

export const createPostLike = async (postId: number) => {
  const response = await axios.post(
    `${baseUrl}/post/${postId}/like`,
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const deletePostLike = async (postId: number) => {
  const response = await axios.delete(`${baseUrl}/post/${postId}/like`, {
    withCredentials: true,
  });
  return response.data;
};
