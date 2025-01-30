import { useContext } from 'react';
import { SidebarContext } from '../../../contexts/SidebarContext';
import AdminSidebar from '../../Sidebar/AdminSidebar';
import AdminNavbar from '../../Admin/AdminNavbar';

export const AdminLayout = ({ children }) => {
  const { isSidebarOpen } = useContext(SidebarContext);

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <AdminSidebar />
      <div className="admin-content">
        <AdminNavbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}; 