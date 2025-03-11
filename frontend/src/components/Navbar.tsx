import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { logout } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { refetch } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    refetch();
  };

  return (
    <nav className="navbar">
      <button className="nav-btn" onClick={() => navigate("/home")}>
        Home
      </button>
      <button className="nav-btn" onClick={() => navigate("/groups")}>
        Groups
      </button>
      <button className="nav-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
