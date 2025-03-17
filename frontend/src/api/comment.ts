import axios from "axios";
import { CreateCommentRequest } from "./models/comment/CreateCommentRequest";

const baseUrl = import.meta.env.VITE_API_URL;

export const createComment = async (
  newCommentRequest: CreateCommentRequest,
) => {
  await axios.post(
    `${baseUrl}/post/${newCommentRequest.postId}/comment`,
    newCommentRequest,
    {
      withCredentials: true,
    },
  );
};
