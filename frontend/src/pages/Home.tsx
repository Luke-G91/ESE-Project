import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../api/post";
import Post from "../components/Post";
import "./Home.css";

const Home = () => {
  const { user, isLoading } = useAuth();

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  if (isLoading || isPostsLoading || !user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Home</h1>
        <p className="home-welcome">Welcome, {user.name}!</p>
      </div>

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
