import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { OrderProvider } from "./contexts/OrderContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import Layout from "./components/layout/Layout";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ShopkeeperDashboard from "./components/Dashboard/ShopkeeperDashboard";
import ProductsPage from "./components/Products/ProductsPage";
import InventoryPage from "./components/Inventory/InventoryPage";
import OrdersPage from "./components/Orders/Orders";
import BillingPage from "./components/Billing/BillingPage";
import UserProfile from "./components/Profile/UserProfile";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import StoresPage from "./components/Admin/Stores/StoresPage";
import ApprovalsPage from "./components/Admin/Approvals/ApprovalsPage";
import UsersPage from "./components/Admin/Users/UsersPage";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <SidebarProvider>
                  <ProductProvider>
                    <InventoryProvider>
                      <OrderProvider>
                        <Layout>
                          <Routes>
                            <Route
                              path="dashboard"
                              element={<AdminDashboard />}
                            />
                            <Route path="stores" element={<StoresPage />} />
                            <Route path="products" element={<ProductsPage />} />
                            <Route path="orders" element={<OrdersPage />} />
                            <Route
                              path="approvals"
                              element={<ApprovalsPage />}
                            />
                            <Route path="profile" element={<UserProfile />} />
                            <Route path="users" element={<UsersPage />} />
                          </Routes>
                        </Layout>
                      </OrderProvider>
                    </InventoryProvider>
                  </ProductProvider>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />

          {/* Shopkeeper Routes */}
          <Route
            path="/shopkeeper/*"
            element={
              <ProtectedRoute allowedRoles={["SHOPKEEPER"]}>
                <SidebarProvider>
                  <ProductProvider>
                    <InventoryProvider>
                      <OrderProvider>
                        <Layout>
                          <Routes>
                            <Route
                              path="dashboard"
                              element={<ShopkeeperDashboard />}
                            />
                            <Route path="products" element={<ProductsPage />} />
                            <Route
                              path="inventory"
                              element={<InventoryPage />}
                            />
                            <Route path="orders" element={<OrdersPage />} />
                            <Route path="billing" element={<BillingPage />} />
                            <Route path="profile" element={<UserProfile />} />
                          </Routes>
                        </Layout>
                      </OrderProvider>
                    </InventoryProvider>
                  </ProductProvider>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
