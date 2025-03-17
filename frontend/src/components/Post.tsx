import { PostViewModel } from "../api/models/post/PostViewModel";
import { createPostLike, deletePostLike } from "../api/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./Post.css";
import { useNavigate } from "react-router-dom";

interface PostProps {
  post: PostViewModel;
  groupId?: number | null;
}

const Post = ({ post, groupId = null }: PostProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    <div className="post-card">
      <div className="post-header">
        <h4 className="post-title">{post.title}</h4>
        <span className="post-date">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="post-body">
        <p className="post-content">{post.content}</p>
      </div>
      <div className="post-footer">
        <div className="post-meta">
          <span className="post-author">Posted by {post.author}</span>
          {!groupId && <span className="post-group"> in {post.group}</span>}
        </div>
        <div className="post-actions">
          <button
            className="action-button"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            Comments
          </button>
          <button className="action-button" onClick={() => toggleLike()}>
            {post.likedByCurrentUser ? "Unlike" : "Like"}
          </button>
          <span className="like-count">{post.likeCount} Likes</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
