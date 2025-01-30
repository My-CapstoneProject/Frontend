// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { useContext } from 'react'
// import { AuthContext } from '../../contexts/AuthContext'
// import './Sidebar.css'

// function ShopkeeperSidebar() {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const { user, logout } = useContext(AuthContext)
//   const currentPath = location.pathname

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <i className="fas fa-store"></i>
//         <h2>Shopkeeper Panel</h2>
//       </div>

//       <div className="user-section">
//         <div className="user-avatar">
//           <i className="fas fa-user-circle"></i>
//         </div>
//         <div className="user-info">
//           <h3>{user?.username}</h3>
//           <span>Shopkeeper</span>
//         </div>
//       </div>
      
//       <nav className="sidebar-nav">
//         <Link 
//           to="/shopkeeper/dashboard" 
//           className={`nav-link ${currentPath === '/shopkeeper/dashboard' ? 'active' : ''}`}
//         >
//           <i className="fas fa-chart-line"></i>
//           <span>Dashboard</span>
//         </Link>
        
//         <Link 
//           to="/shopkeeper/inventory" 
//           className={`nav-link ${currentPath === '/shopkeeper/inventory' ? 'active' : ''}`}
//         >
//           <i className="fas fa-boxes"></i>
//           <span>Inventory</span>
//         </Link>
        
//         <Link 
//           to="/shopkeeper/orders" 
//           className={`nav-link ${currentPath === '/shopkeeper/orders' ? 'active' : ''}`}
//         >
//           <i className="fas fa-shopping-cart"></i>
//           <span>Orders</span>
//         </Link>

//         <Link 
//           to="/shopkeeper/billing" 
//           className={`nav-link ${currentPath === '/shopkeeper/billing' ? 'active' : ''}`}
//         >
//           <i className="fas fa-cash-register"></i>
//           <span>Billing</span>
//         </Link>
//       </nav>

//       <div className="sidebar-footer">
//         <Link 
//           to="/shopkeeper/profile" 
//           className={`nav-link ${currentPath === '/shopkeeper/profile' ? 'active' : ''}`}
//         >
//           <i className="fas fa-user-cog"></i>
//           <span>Profile</span>
//         </Link>
//         <button className="nav-link logout-btn" onClick={handleLogout}>
//           <i className="fas fa-sign-out-alt"></i>
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   )
// }

// export default ShopkeeperSidebar 