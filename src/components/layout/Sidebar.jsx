import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  const adminLinks = [
    {
      path: '/admin/dashboard',
      icon: 'fas fa-chart-line',
      label: 'Dashboard'
    },
    {
      path: '/admin/users',
      icon: 'fas fa-users',
      label: 'Users'
    },
    {
      path: '/admin/stores',
      icon: 'fas fa-store',
      label: 'Stores'
    },
    {
      path: '/admin/approvals',
      icon: 'fas fa-check-circle',
      label: 'Approvals'
    }
  ];

  const shopkeeperLinks = [
    {
      path: '/dashboard',
      icon: 'fas fa-chart-line',
      label: 'Dashboard'
    },
    {
      path: '/inventory',
      icon: 'fas fa-box',
      label: 'Inventory'
    },
    {
      path: '/orders',
      icon: 'fas fa-shopping-cart',
      label: 'Orders'
    }
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : shopkeeperLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 