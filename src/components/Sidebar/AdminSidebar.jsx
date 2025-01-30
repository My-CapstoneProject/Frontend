// import { Link, useLocation } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../../contexts/AuthContext';
// import { SidebarContext } from '../../contexts/SidebarContext';
// import './Sidebar.css';

// function AdminSidebar() {
//   const location = useLocation();
//   const { user } = useContext(AuthContext);
//   const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

//   const isActive = (path) => {
//     return location.pathname.includes(path);
//   };

//   const menuItems = [
//     {
//       path: '/admin/dashboard',
//       icon: 'fas fa-chart-line',
//       label: 'Dashboard'
//     },
//     {
//       path: '/admin/products',
//       icon: 'fas fa-box',
//       label: 'Products'
//     },
//     {
//       path: '/admin/stores',
//       icon: 'fas fa-store',
//       label: 'Stores'
//     },
//     {
//       path: '/admin/users',
//       icon: 'fas fa-users',
//       label: 'Users'
//     },
//     {
//       path: '/admin/orders',
//       icon: 'fas fa-shopping-cart',
//       label: 'Orders'
//     },
//     {
//       path: '/admin/approvals',
//       icon: 'fas fa-check-circle',
//       label: 'Approvals'
//     }
//   ];

//   return (
//     <>
//       <div className={`sidebar admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
//         <div className="sidebar-header">
//           <div className="logo-section">
//             <i className="fas fa-shield-alt"></i>
//             <h2>Admin Panel</h2>
//           </div>
//         </div>
        
//         <div className="user-section">
//           <div className="user-avatar">
//             <i className="fas fa-user-circle"></i>
//           </div>
//           <div className="user-info">
//             <h3>{user?.username}</h3>
//             <span>Administrator</span>
//           </div>
//         </div>
        
//         <nav className="sidebar-nav">
//           {menuItems.map((item) => (
//             <Link 
//               key={item.path}
//               to={item.path} 
//               className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
//             >
//               <i className={item.icon}></i>
//               <span>{item.label}</span>
//             </Link>
//           ))}
//         </nav>
        
//         <div className="sidebar-footer">
//           <Link 
//             to="/admin/profile" 
//             className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
//           >
//             <i className="fas fa-user-cog"></i>
//             <span>Settings</span>
//           </Link>
//         </div>
//       </div>
//       <div 
//         className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
//         onClick={toggleSidebar}
//       />
//     </>
//   );
// }

// export default AdminSidebar;