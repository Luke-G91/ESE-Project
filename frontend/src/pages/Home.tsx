import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../api/post";
import Post from "../components/Post";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, refetch, isLoading } = useAuth();

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    refetch();
  };

  if (isLoading || isPostsLoading || !user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="home-buttons">
          <button className="btn" onClick={() => navigate("/groups")}>
            Groups
          </button>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1 className="home-title">Home</h1>
        <p className="home-welcome">Welcome, {user.name}!</p>
      </div>

      <h2 className="posts-title">Posts</h2>
      <div className="posts-container">
        <ul className="posts-list">
          {posts && posts.length > 0 ? (
            posts.map((post) => <Post post={post} key={post.id} />)
          ) : (
            <div>There are no posts to view</div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
