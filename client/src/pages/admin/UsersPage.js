// src/pages/admin/UserPage.js
import React, { useEffect, useState } from "react";
import { message, Modal, Row, Col } from "antd";
import {
  apiGetUsers,
  apiDeleteUser,
  apiUpdateUserByAdmin,
} from "../../apis/user";
import UserTable from "../../components/admin/UserTable";
import UserForm from "../../components/admin/UserForm";
import StatCard from "../../components/admin/StatCard";
import {
  UserOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await apiGetUsers();
      if (res?.success) {
        setUsers(res.user || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleDelete = async (uid) => {
    const res = await apiDeleteUser(uid);
    if (res?.data?.success) {
      message.success("User deleted");
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = async () => {
    const res = await apiUpdateUserByAdmin(editingUser._id, {
      role: editingUser.role,
      isBlocked: editingUser.isBlocked,
    });
    if (res?.data?.success) {
      message.success("User updated");
      setEditingUser(null);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Thống kê ---
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.isBlocked).length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>

      {/* Stat Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<UserOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col span={8}>
          <StatCard
            title="Active Users"
            value={activeUsers}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col span={8}>
          <StatCard
            title="Blocked Users"
            value={blockedUsers}
            icon={<StopOutlined />}
            color="#ff4d4f"
          />
        </Col>
      </Row>

      {/* User Table */}
      <UserTable
        dataSource={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title="Edit User"
        open={!!editingUser}
        onOk={handleSave}
        onCancel={() => setEditingUser(null)}
      >
        {editingUser && (
          <UserForm
            user={editingUser}
            onChange={(updated) => setEditingUser(updated)}
          />
        )}
      </Modal>
    </div>
  );
};

export default UserPage;
