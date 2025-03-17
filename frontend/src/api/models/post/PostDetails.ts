import { CommentViewModel } from "../comment/CommentViewModel.js";

export interface PostDetails {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  author: string;
  group: string;
  likeCount: number;
  likedByCurrentUser: boolean;
  comments: CommentViewModel[];
}
