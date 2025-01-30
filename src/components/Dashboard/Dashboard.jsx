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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log("Current user:", user); // Debug log
    fetchSalesData();
  }, [user]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const storeId = user?.storeId;
      console.log("User storeId:", storeId); // Debug log

      if (!storeId) {
        throw new Error("No store ID found");
      }

      const orders = await orderService.getByStore(storeId);
      console.log("Fetched orders:", orders); // Debug log

      if (!Array.isArray(orders)) {
        throw new Error("Invalid orders data received");
      }

      // Process orders to get category-wise sales
      const categorySales = orders.reduce((acc, order) => {
        console.log("Processing order:", order); // Debug log
        if (!order.items) {
          console.log("No items in order:", order.id);
          return acc;
        }

        order.items.forEach((item) => {
          console.log("Processing item:", item); // Debug log
          if (item.category) {
            acc[item.category] =
              (acc[item.category] || 0) + (item.quantity || 0);
          }
        });
        return acc;
      }, {});

      console.log("Final sales data:", categorySales); // Debug log
      setSalesData(categorySales);
    } catch (err) {
      console.error("Error in fetchSalesData:", err);
      setError(err.message || "Failed to fetch sales data");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: salesData ? Object.keys(salesData) : [],
    datasets: [
      {
        label: "Products Sold",
        data: salesData ? Object.values(salesData) : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)", // Red
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(255, 206, 86, 0.5)", // Yellow
          "rgba(75, 192, 192, 0.5)", // Teal
          "rgba(153, 102, 255, 0.5)", // Purple
          "rgba(255, 159, 64, 0.5)", // Orange
          "rgba(76, 175, 80, 0.5)", // Green
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
        text: `Sales Overview - ${user?.name || "Store"}`,
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

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Sales Overview</h1>
        <div className="store-info">
          Store ID: {user?.storeId || "Not available"}
        </div>
        {error && <div className="error">{error}</div>}
        {salesData && Object.keys(salesData).length === 0 && (
          <div className="no-data">No sales data available for this store.</div>
        )}
      </div>

      <div className="stats-container">
        <div className="chart-card">
          <div className="chart-container">
            {salesData && Object.keys(salesData).length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="no-data-message">
                No sales data to display. Make sure you have completed orders.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
