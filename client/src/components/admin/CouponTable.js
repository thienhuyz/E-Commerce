import { Table, Tag, Button, Space, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const CouponTable = ({ dataSource = [], onEdit, onDelete }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      key: "discount",
      render: (d) => `${d}%`,
    },
    {
      title: "Expiry",
      dataIndex: "expiry",
      key: "expiry",
      render: (date) =>
        date ? (
          dayjs(date).isBefore(dayjs()) ? (
            <Tag color="red">{dayjs(date).format("DD/MM/YYYY")}</Tag>
          ) : (
            <Tag color="green">{dayjs(date).format("DD/MM/YYYY")}</Tag>
          )
        ) : (
          "-"
        ),
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
              title="Are you sure?"
              onConfirm={() => onDelete(record)}
            >
              <Button danger shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return <Table rowKey="_id" columns={columns} dataSource={dataSource} />;
};

export default CouponTable;
