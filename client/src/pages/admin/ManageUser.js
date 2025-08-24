// src/pages/admin/UserPage.js
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Row, Col, Table } from "antd";
import { apiGetUsers, apiDeleteUser, apiUpdateUser } from "../../apis/user";
import UserForm from "../../components/admin/UserForm";
import StatCard from "../../components/admin/StatCard";
import { UserOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { roles } from "../../utils/contants";
import moment from "moment";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lấy mảng users từ mọi kiểu response thường gặp
  const pickUsersArray = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.users)) return res.users;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };

  // Fetch users theo format response.success / response.users
  const fetchUsers = async (params) => {
    try {
      setLoading(true);
      const response = await apiGetUsers(params);
      const list = pickUsersArray(response);
      setUsers(list);
      if (!response?.success && list.length === 0) {
        toast.warn(response?.mes || "Không tải được danh sách người dùng.");
      }
    } catch {
      toast.error("Lỗi khi tải danh sách người dùng.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => setEditingUser(user);

  // Update theo format response.success / response.mes
  const handleSave = async () => {
    if (!editingUser) return;

    const payload = {
      firstname: editingUser.firstname,
      lastname: editingUser.lastname,
      email: editingUser.email,
      mobile: editingUser.mobile,
      role: Number(editingUser.role),
      isBlocked: !!editingUser.isBlocked,
    };

    try {
      setSaving(true);
      const response = await apiUpdateUser(payload, editingUser._id);

      if (response?.success) {
        toast.success(response?.mes || "Cập nhật thành công");
        setEditingUser(null);   // đóng modal
        fetchUsers();           // reload bảng
      } else {
        toast.error(response?.mes || "Cập nhật thất bại");
      }
    } catch {
      toast.error("Có lỗi khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  // Delete theo format response.success / response.mes (giữ nguyên apiDeleteUser hiện tại)
  const handleDelete = async (uid) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn có muốn xoá người dùng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xoá ngay",
      cancelButtonText: "Huỷ",
      reverseButtons: true,
      focusCancel: true,
    });
    if (!result.isConfirmed) return;

    try {
      // Vì apiDeleteUser đang là: url: '/user/' + uid
      // Controller của bạn nhận _id qua query → truyền dạng `?_id=...`
      const response = await apiDeleteUser(`?_id=${uid}`);

      if (response?.success) {
        toast.success(response?.mes || "Xoá người dùng thành công");
        fetchUsers();
      } else {
        toast.error(response?.mes || "Xoá thất bại");
      }
    } catch {
      toast.error("Có lỗi khi xoá");
    }
  };

  // Table data
  const tableData = useMemo(
    () =>
      (users || []).map((el, idx) => ({
        _id: el._id,
        stt: idx + 1,
        email: el.email,
        fullname: `${el.firstname ?? ""} ${el.lastname ?? ""}`.trim(),
        role: roles.find((r) => +r.code === +el.role)?.value || "",
        phone: el.mobile ?? el.phone ?? "",
        status: el.isBlocked ? "Blocked" : "Active",
        createdAt: el.createdAt ? moment(el.createdAt).format("DD/MM/YYYY") : "",
        raw: el,
      })),
    [users]
  );

  const columns = [
    { title: "STT", dataIndex: "stt", width: 64, align: "center" },
    { title: "Email", dataIndex: "email", align: "center" },
    { title: "Họ và Tên", dataIndex: "fullname", align: "center" },
    { title: "Chức vụ", dataIndex: "role", align: "center" },
    { title: "Số điện thoại", dataIndex: "phone", align: "center" },
    { title: "Trạng thái", dataIndex: "status", align: "center" },
    { title: "Thời gian tạo", dataIndex: "createdAt", align: "center" },
    {
      title: "Chức năng",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="space-x-3">
          <span style={{ color: "#1677ff", cursor: "pointer" }} onClick={() => handleEdit(record.raw)}>
            Sửa
          </span>
          <span style={{ color: "#ff4d4f", cursor: "pointer" }} onClick={() => handleDelete(record.raw._id)}>
            Xoá
          </span>
        </div>
      ),
    },
  ];

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u?.isBlocked).length;
  const blockedUsers = users.filter((u) => u?.isBlocked).length;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <StatCard title="Tất cả người dùng" value={totalUsers} icon={<UserOutlined />} color="#1890ff" />
        </Col>
        <Col span={8}>
          <StatCard title="Người dùng hoạt động" value={activeUsers} icon={<CheckCircleOutlined />} color="#52c41a" />
        </Col>
        <Col span={8}>
          <StatCard title="Người dùng bị khoá" value={blockedUsers} icon={<StopOutlined />} color="#ff4d4f" />
        </Col>
      </Row>

      <Table columns={columns} dataSource={tableData} loading={loading} pagination={{ pageSize: 10 }} rowKey="_id" />

      <Modal
        title="Edit User"
        open={!!editingUser}
        onOk={handleSave}
        confirmLoading={saving}
        onCancel={() => setEditingUser(null)}
        destroyOnClose
      >
        {editingUser && (
          <UserForm
            user={editingUser}
            onChange={(updated) => setEditingUser((prev) => ({ ...(prev || {}), ...updated }))}
          />
        )}
      </Modal>
    </div>
  );
};

export default UserPage;
