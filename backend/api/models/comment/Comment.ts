export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  userId: number;
  postId: number;
}
