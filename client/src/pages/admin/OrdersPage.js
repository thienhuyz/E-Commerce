import { useEffect, useState } from "react";
import {
  PlusOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { apiGetAllOrders } from "../../apis/order";
import OrderTabs from "../../components/admin/OrderTabs";
import StatCard from "../../components/admin/StatCard";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    succeed: 0,
    cancelled: 0,
  });

  // Hàm tính thống kê
  const calculateStats = (ordersData) => {
    const total = ordersData.length;
    const processing = ordersData.filter(
      (o) => o.status === "Processing"
    ).length;
    const succeed = ordersData.filter((o) => o.status === "Succeed").length;
    const cancelled = ordersData.filter((o) => o.status === "Cancelled").length;
    setStats({ total, processing, succeed, cancelled });
  };

  // Fetch orders từ API
  const fetchOrders = async () => {
    try {
      const res = await apiGetAllOrders();
      if (res?.success) {
        const data = res.response || [];
        setOrders(data);
        calculateStats(data); // tính ngay khi fetch
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Khi đổi trạng thái order
  const handleStatusChange = (oid, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order._id === oid ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    calculateStats(updatedOrders); // cập nhật thống kê ngay
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Order List</h2>
      </div>

      {/* Cards thống kê */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon={<ShoppingCartOutlined />}
          color="#1890ff"
        />
        <StatCard
          title="Processing Orders"
          value={stats.processing}
          icon={<ClockCircleOutlined />}
          color="#faad14"
        />
        <StatCard
          title="Completed Orders"
          value={stats.succeed}
          icon={<CheckCircleOutlined />}
          color="#52c41a"
        />
        <StatCard
          title="Cancelled Orders"
          value={stats.cancelled}
          icon={<CloseCircleOutlined />}
          color="#ff4d4f"
        />
      </div>

      {/* Tabs + Table */}
      <OrderTabs orders={orders} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default OrdersPage;
