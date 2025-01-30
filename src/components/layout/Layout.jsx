import { useAuth } from "../../contexts/AuthContext";
import { useSidebar } from "../../contexts/SidebarContext";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import "./Layout.css";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const { isOpen } = useSidebar();

  if (!user) {
    return null;
  }

  return (
    <div className={`layout ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
