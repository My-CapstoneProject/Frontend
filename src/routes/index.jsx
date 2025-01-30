import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import UsersPage from '../components/Admin/UsersPage';
import StoresPage from '../components/Admin/StoresPage';
import ApprovalsPage from '../components/Admin/Approvals/ApprovalsPage';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'admin',
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            path: 'dashboard',
            element: <AdminDashboard />
          },
          {
            path: 'users',
            element: <UsersPage />
          },
          {
            path: 'stores',
            element: <StoresPage />
          },
          {
            path: 'approvals',
            element: <ApprovalsPage />
          }
        ]
      }
    ]
  }
]); 