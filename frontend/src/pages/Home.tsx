import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../api/post";
import Post from "../components/Post";

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome, {user.name}!</p>

      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate("/groups")}>Groups</button>

      <h2>Posts</h2>
      <ul>{posts?.map((post) => <Post post={post} key={post.id} />)}</ul>
    </div>
  );
};

export default Home;
