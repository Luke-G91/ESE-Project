import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();

  const { user, refetch, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome, {user.name}!</p>
      <p>Your email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
