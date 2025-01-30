import { useState, useEffect } from "react";
import { storeService, orderService, authService, productService } from "../../services/api";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: [],
    stores: [],
    orders: [],
    revenue: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("monthly");
  const [summaryData, setSummaryData] = useState({
    totalProducts: 0,
    totalStores: 0,
    dailyRevenue: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [users, stores, orders, revenue] = await Promise.all([
        authService.getUserStats(timeRange),
        storeService.getStoresRevenue(timeRange),
        orderService.getOrderStats(timeRange),
        orderService.getRevenueStats(timeRange)
      ]);

      const [products] = await Promise.all([
        productService.getAll()
      ]);

      // Calculate daily revenue safely
      const today = new Date().toISOString().split('T')[0];
      let dailyRevenue = 0;

      if (revenue && Array.isArray(revenue)) {
        const todayRevenue = revenue.find(item => 
          item.date === today || 
          new Date(item.date).toISOString().split('T')[0] === today
        );
        dailyRevenue = todayRevenue ? todayRevenue.amount : 0;
      }

      setAnalyticsData({ users, stores, orders, revenue });
      setSummaryData({
        totalProducts: products?.length || 0,
        totalStores: stores?.length || 0,
        dailyRevenue: dailyRevenue,
        activeUsers: stores?.filter(store => store.status === 'ACTIVE')?.length || 0
      });
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const userChartData = {
    labels: analyticsData.users.map(data => data.date),
    datasets: [
      {
        label: 'New Users',
        data: analyticsData.users.map(data => data.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      },
      {
        label: 'Active Users',
        data: analyticsData.users.map(data => data.activeCount),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const revenueChartData = {
    labels: analyticsData.revenue.map(data => data.date),
    datasets: [{
      label: 'Revenue',
      data: analyticsData.revenue.map(data => data.amount),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  const orderChartData = {
    labels: analyticsData.orders.map(data => data.date),
    datasets: [{
      label: 'Orders',
      data: analyticsData.orders.map(data => data.count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dashboard Analytics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="time-range-selector">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon products">
            <i className="fas fa-box"></i>
          </div>
          <div className="card-info">
            <h3>Total Products</h3>
            <p className="card-value">{summaryData.totalProducts}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon stores">
            <i className="fas fa-store"></i>
          </div>
          <div className="card-info">
            <h3>Active Stores</h3>
            <p className="card-value">{summaryData.totalStores}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="card-info">
            <h3>Today's Revenue</h3>
            <p className="card-value">
              ${summaryData.dailyRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon users">
            <i className="fas fa-users"></i>
          </div>
          <div className="card-info">
            <h3>Active Users</h3>
            <p className="card-value">{summaryData.activeUsers}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>User Growth</h2>
          <Line data={userChartData} options={chartOptions} />
        </div>

        <div className="chart-card">
          <h2>Revenue Trend</h2>
          <Bar data={revenueChartData} options={chartOptions} />
        </div>

        <div className="chart-card">
          <h2>Order Statistics</h2>
          <Bar data={orderChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
