import ViewPostModel from "../api/models/post/ViewPostModel";

interface PostProps {
  post: ViewPostModel;
}
const Post = ({ post }: PostProps) => {
  return (
    <li key={post.id}>
      <h4>{post.title}</h4>
      <p>{post.content}</p>
    </li>
  );
};

export default Post;
