import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSidebar } from "../../contexts/SidebarContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user } = useAuth();
  const { isOpen, toggleSidebar, isMobile } = useSidebar();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const baseRoute = user?.role.toLowerCase();
  console.log(baseRoute)
  const menuItems =
    user?.role === "ADMIN"
      ? [
          {
            path: `/${baseRoute}/dashboard`,
            icon: "dashboard",
            label: "Dashboard",
          },
          {
            path: `/${baseRoute}/products`,
            icon: "inventory",
            label: "Products",
          },
          {
            path: `/${baseRoute}/stores`,
            icon: "store",
            label: "Stores",
          },
          {
            path: `/${baseRoute}/users`,
            icon: "people",
            label: "Users",
          },
          {
            path: `/${baseRoute}/orders`,
            icon: "shopping_cart",
            label: "Orders",
          },
          {
            path: `/${baseRoute}/approvals`,
            icon: "how_to_reg",
            label: "Approvals",
          },
          {
            path: `/${baseRoute}/profile`,
            icon: "person",
            label: "Profile",
          },
        ]
      : [
          {
            path: `/${baseRoute}/dashboard`,
            icon: "dashboard",
            label: "Dashboard",
          },
          {
            path: `/${baseRoute}/inventory`,
            icon: "inventory",
            label: "Inventory",
          },
          {
            path: `/${baseRoute}/orders`,
            icon: "shopping_cart",
            label: "Orders",
          },
          { path: `/${baseRoute}/billing`, icon: "receipt", label: "Billing" },
          { path: `/${baseRoute}/profile`, icon: "person", label: "Profile" },
        ];

  return (
    <>
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>My Supermarket</h2>
          {isMobile && (
            <button className="close-sidebar" onClick={toggleSidebar}>
              <span className="material-icons">close</span>
            </button>
          )}
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="link-text">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
