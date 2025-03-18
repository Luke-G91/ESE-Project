import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./PostDetail.css";
import { toast } from "react-toastify";
import { ChangeEvent, FormEvent, useState } from "react";
import { getPostDetails } from "../api/post";
import { createComment } from "../api/comment";
import Comment from "../components/Comment";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const postIdNumber = Number(postId);

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["postDetails", postIdNumber],
    queryFn: () => getPostDetails(postIdNumber),
    enabled: !!postId,
  });

  const { mutate: addComment } = useMutation({
    mutationFn: (newComment: { postId: number; content: string }) =>
      createComment(newComment),
    onSuccess: () => {
      // invalidate query to get most recent post details after creating a comment
      queryClient.invalidateQueries({
        queryKey: ["postDetails", postIdNumber],
      });
      // reset form
      setNewComment("");
      toast.success("Comment created");
    },
    onError: (err) => {
      console.warn(err);
      toast.error("Failed to create comment");
    },
  });

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  // prevent default to stop form submissions from sending default form requests
  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    addComment({ postId: postIdNumber, content: newComment });
  };

  if (isPostLoading || !post) {
    return <div>Loading post...</div>;
  }
  return (
    <div className="post-detail-container">
      <div className="post-detail-card">
        <div className="post-detail-header">
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-detail-meta">
            <span>Posted by {post.author}</span>
            <span className="post-detail-date">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="post-detail-body">
          <p className="post-detail-content">{post.content}</p>
        </div>
        <div className="post-detail-comments-section">
          <h2>Comments</h2>
          {post.comments.map((comment) => (
            <Comment comment={comment} />
          ))}

          <form
            className="post-detail-comment-form"
            onSubmit={handleCommentSubmit}
          >
            <textarea
              name="comment"
              value={newComment}
              onChange={handleCommentChange}
              required
            />
            <button type="submit" className="post-detail-btn">
              Add Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
