// src/components/OrderTable.js
import React from "react";
import { Table, Tag, Select, message } from "antd";
import { apiUpdateOrderStatus } from "../../apis/order";

const OrderTable = ({ data }) => {
  const handleStatusChange = async (oid, newStatus) => {
    try {
      const res = await apiUpdateOrderStatus(oid, { status: newStatus });
      if (res?.success) {
        message.success("Order status updated successfully");
      } else {
        message.error(res?.message || "Failed to update status");
      }
    } catch (error) {
      message.error("Error updating order status");
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "_id", key: "_id" },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (v) => `$${v}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "completed"
            ? "green"
            : status === "pending"
            ? "orange"
            : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            { value: "Pending", label: "Pending" },
            { value: "Completed", label: "Completed" },
            { value: "Cancelled", label: "Cancelled" },
          ]}
        />
      ),
    },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <div>
      {/* Table */}
      <Table columns={columns} dataSource={data} rowKey="_id" />
    </div>
  );
};

export default OrderTable;
