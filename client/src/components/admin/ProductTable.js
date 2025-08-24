// src/components/admin/ProductTable.js
import { Table, Tag, Image, Button, Space, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ProductTable = ({
  dataSource = [],
  pagination = { current: 1, pageSize: 10, total: 0 },
  onEdit,
  onDelete,
  onChange,
}) => {
  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumb",
      key: "thumb",
      render: (thumb) =>
        thumb ? <Image width={50} src={thumb} /> : <Tag>No Image</Tag>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price !== undefined ? `$${Number(price).toLocaleString()}` : "-",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (q) =>
        q > 0 ? (
          <Tag color="green">{q} in stock</Tag>
        ) : (
          <Tag color="red">Sold Out</Tag>
        ),
    },
    {
      title: "Sold",
      dataIndex: "sold",
      key: "sold",
      render: (sold) => sold ?? 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this product?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(record)}
            >
              <Button danger shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={dataSource}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: false,
        onChange: (page, pageSize) => {
          if (onChange) onChange({ current: page, pageSize });
        },
      }}
    />
  );
};

export default ProductTable;
