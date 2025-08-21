import React, { useState } from "react";
import { Table, Tag, Select, message, Spin } from "antd";
import { apiUpdateOrderStatus } from "../../apis/order";

const OrderTable = ({ data, onStatusChange }) => {
  const [loading, setLoading] = useState(false); // state loading riêng cho Table

  const handleStatusChange = async (oid, newStatus) => {
    setLoading(true); // bật spinner
    try {
      const res = await apiUpdateOrderStatus(oid, { status: newStatus });
      if (res?.success) {
        message.success("Order status updated successfully");
        onStatusChange(oid, newStatus); // cập nhật parent state
      } else {
        message.error(res?.message || "Failed to update status");
      }
    } catch (error) {
      message.error("Error updating order status");
    } finally {
      setLoading(false); // tắt spinner
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "_id", key: "_id" },
    {
      title: "Products",
      key: "products",
      render: (_, record) => record.products?.length || 0,
    },
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
          status === "Succeed"
            ? "green"
            : status === "Processing"
            ? "orange"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Coupon",
      key: "coupon",
      render: (_, record) =>
        record.coupon
          ? record.coupon.toString().length > 10
            ? record.coupon.toString().slice(0, 10) + "..."
            : record.coupon.toString()
          : "-",
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
            { value: "Processing", label: "Processing" },
            { value: "Succeed", label: "Succeed" },
            { value: "Cancelled", label: "Cancelled" },
          ]}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => new Date(v).toLocaleString(),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table columns={columns} dataSource={data} rowKey="_id" />
    </Spin>
  );
};

export default OrderTable;
