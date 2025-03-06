import axios from "axios";
import ViewPostModel from "./models/post/ViewPostModel";
import CreatePostRequest from "./models/post/CreatePostRequest";

const baseUrl = import.meta.env.VITE_API_URL;

export const getAllPosts = async (): Promise<ViewPostModel[]> => {
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
