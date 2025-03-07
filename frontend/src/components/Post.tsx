import { PostViewModel } from "../api/models/post/PostViewModel";
import { createPostLike, deletePostLike } from "../api/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostProps {
  post: PostViewModel;
  groupId: number | null;
}

const Post = ({ post, groupId = null }: PostProps) => {
  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      if (post.likedByCurrentUser) {
        await deletePostLike(post.id);
      } else {
        await createPostLike(post.id);
      }
    },
    onSuccess: () => {
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: ["groupPosts", groupId] });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <li key={post.id}>
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <p>
        Posted by {post.author} {!groupId && `in ${post.group}`}
      </p>

      <div>
        <button onClick={() => toggleLike()}>
          {post.likedByCurrentUser ? "Unlike" : "Like"}
        </button>
        {post.likeCount} Likes
      </div>
    </li>
  );
};

export default Post;
