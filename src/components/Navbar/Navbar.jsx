import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSidebar } from "../../contexts/SidebarContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  // const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
      
        <h1 className="navbar-title">
          {user?.role === "ADMIN" ? "Admin Dashboard" : "Store Dashboard"}
        </h1>
      </div>
      <div className="navbar-right">
        <span className="user-name">Welcome, {user?.name || user?.username}</span>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
