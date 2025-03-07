export interface PostViewModel {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  author: string;
  group: string;
  likeCount: number;
  likedByCurrentUser: boolean;
}
