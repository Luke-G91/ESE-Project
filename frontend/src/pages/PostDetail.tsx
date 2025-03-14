import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./PostDetail.css";
import { toast } from "react-toastify";
import { ChangeEvent, FormEvent, useState } from "react";
import { getPostDetails } from "../api/post";
import { createComment } from "../api/comment";

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
      queryClient.invalidateQueries({
        queryKey: ["postDetails", postIdNumber],
      });
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

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    addComment({ postId: postIdNumber, content: newComment });
  };

  if (isPostLoading || !post) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <h1>{post.title}</h1>
        <p>By {post.author}</p>
        <p>{post.content}</p>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>
        {post.comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <p>{comment.content}</p>
            <p>Commented by {comment.author}</p>
          </div>
        ))}

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            name="comment"
            value={newComment}
            onChange={handleCommentChange}
            required
          />
          <button type="submit" className="btn">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostDetail;
