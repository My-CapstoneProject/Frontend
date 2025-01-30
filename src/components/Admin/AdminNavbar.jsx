import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import "./AdminNavbar.css";
import "./Admin.css";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { toggleSidebar } = useContext(SidebarContext);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav className="admin-navbar">
      <div className="navbar-brand">
        <h1>My Supermarket</h1>
      </div>
      <div className="navbar-user">
        <span>Welcome, {user?.username}</span>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
