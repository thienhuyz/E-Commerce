// src/components/admin/CategoryTable.js
import { Table, Tag, Space, Button, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryTable = ({
  dataSource = [],
  onEdit,
  onDelete,
  onChange,
  pagination = { current: 1, pageSize: 10, total: 0 },
}) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Brands",
      dataIndex: "brand",
      key: "brand",
      render: (brands) => brands.join(", "),
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
              title="Are you sure to delete this category?"
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
        onChange: (page, pageSize) =>
          onChange && onChange({ current: page, pageSize }),
      }}
    />
  );
};

export default CategoryTable;
