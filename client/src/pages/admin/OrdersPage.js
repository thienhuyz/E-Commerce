import { useEffect, useState } from "react";
import { Button } from "antd";
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

  useEffect(() => {
    (async () => {
      const res = await apiGetAllOrders();
      if (res?.success) {
        setOrders(res.orders || []); // fallback mảng rỗng
      }
    })();
  }, []);

  const handleStatusChange = (oid, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === oid ? { ...order, status: newStatus } : order
      )
    );
  };

  // Thống kê
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter((o) => o.status === "Completed").length;
  const canceledOrders = orders.filter((o) => o.status === "Canceled").length;

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
          value={totalOrders}
          icon={<ShoppingCartOutlined />}
          color="#1890ff"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon={<ClockCircleOutlined />}
          color="#faad14"
        />
        <StatCard
          title="Completed Orders"
          value={completedOrders}
          icon={<CheckCircleOutlined />}
          color="#52c41a"
        />
        <StatCard
          title="Canceled Orders"
          value={canceledOrders}
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
