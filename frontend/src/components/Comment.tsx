import "./Comment.css";
import { CommentViewModel } from "../api/models/comment/CommentViewModel";

type CommentProps = {
  comment: CommentViewModel;
};

const Comment = ({ comment }: CommentProps) => {
  return (
    <div key={comment.id} className="post-detail-comment-card">
      <div className="post-detail-comment-header">
        <span className="post-detail-comment-author">{comment.author}</span>
        <span className="post-detail-comment-date">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="post-detail-comment-content">{comment.content}</p>
    </div>
  );
};

export default Comment;
