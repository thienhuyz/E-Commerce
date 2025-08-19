// src/components/OrderTabs.js
import { Tabs } from "antd";
import OrderTable from "./OrderTable";

const OrderTabs = ({ orders = [], onStatusChange }) => {
  const completed = orders.filter((o) => o.status === "completed");
  const pending = orders.filter((o) => o.status === "pending");
  const cancelled = orders.filter((o) => o.status === "cancelled");

  const items = [
    {
      key: "1",
      label: "All Orders",
      children: <OrderTable data={orders} onStatusChange={onStatusChange} />,
    },
    {
      key: "2",
      label: "Completed",
      children: <OrderTable data={completed} onStatusChange={onStatusChange} />,
    },
    {
      key: "3",
      label: "Pending",
      children: <OrderTable data={pending} onStatusChange={onStatusChange} />,
    },
    {
      key: "4",
      label: "Cancelled",
      children: <OrderTable data={cancelled} onStatusChange={onStatusChange} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default OrderTabs;
