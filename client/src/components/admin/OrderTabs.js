import React from "react";
import { Tabs } from "antd";
import OrderTable from "./OrderTable";

const OrderTabs = ({ orders = [] }) => {
  const items = [
    {
      key: "all",
      label: "All",
      children: <OrderTable data={orders} />,
    },
    {
      key: "processing",
      label: "Processing",
      children: (
        <OrderTable data={orders.filter((o) => o.status === "processing")} />
      ),
    },
    {
      key: "completed",
      label: "Completed",
      children: (
        <OrderTable data={orders.filter((o) => o.status === "completed")} />
      ),
    },
    {
      key: "cancelled",
      label: "Cancelled",
      children: (
        <OrderTable data={orders.filter((o) => o.status === "cancelled")} />
      ),
    },
  ];

  return <Tabs defaultActiveKey="all" items={items} />;
};

export default OrderTabs;
