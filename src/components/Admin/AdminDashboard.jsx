import { useState, useEffect } from "react";
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
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Changed from getAll to getAllOrders
      const orders = await orderService.getAllOrders();
      console.log("Fetched orders:", orders);

      if (!Array.isArray(orders)) {
        throw new Error("Invalid orders data received");
      }

      // Process orders to get category-wise sales
      const categorySales = orders.reduce((acc, order) => {
        if (!order.items) {
          console.log("No items in order:", order.id);
          return acc;
        }

        order.items.forEach((item) => {
          if (item.category) {
            acc[item.category] =
              (acc[item.category] || 0) + (item.quantity || 0);
          }
        });
        return acc;
      }, {});

      console.log("Processed sales data:", categorySales);
      setSalesData(categorySales);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: salesData ? Object.keys(salesData) : [],
    datasets: [
      {
        label: "Total Products Sold",
        data: salesData ? Object.values(salesData) : [],
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
        text: "Overall Category-wise Sales",
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
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="stats-container">
        <div className="chart-card">
          <div className="chart-container">
            {salesData && Object.keys(salesData).length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="no-data-message">No sales data available yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
