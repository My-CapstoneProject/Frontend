import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ShopkeeperDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    categorySales: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getByStore(user?.storeId);
      console.log("Fetched orders:", orders);

      const pendingOrders = orders.filter(
        (order) => order.status === "PENDING"
      ).length;

      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );

      // Calculate category-wise sales
      const categorySales = orders.reduce((acc, order) => {
        order.items?.forEach((item) => {
          if (item.category) {
            acc[item.category] =
              (acc[item.category] || 0) + (item.quantity || 0);
          }
        });
        return acc;
      }, {});

      console.log("Category sales:", categorySales);

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        categorySales,
      });
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: Object.keys(stats.categorySales),
    datasets: [
      {
        label: "Products Sold",
        data: Object.values(stats.categorySales),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(76, 175, 80, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(76, 175, 80, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Category-wise Sales",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Products",
        },
      },
      x: {
        title: {
          display: true,
          text: "Categories",
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Sales Overview</h1>
        <div className="store-info">
          Store ID: {user?.storeId || "Not available"}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-container">
          {Object.keys(stats.categorySales).length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="no-data-message">No sales data available yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;
