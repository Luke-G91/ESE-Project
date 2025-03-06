export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  authorId: number;
  chatGroupId: number;
}
