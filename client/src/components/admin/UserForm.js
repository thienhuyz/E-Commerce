// src/components/admin/UserForm.jsx
import React from "react";
import { Input, Select, Switch } from "antd";
import { roles } from "../../utils/contants"; // [{ code: 1945, value: "Admin" }, { code: 1979, value: "User" }]

const UserForm = ({ user, onChange }) => {
  if (!user) return null;

  const handleChange = (field, value) => {
    onChange({ ...user, [field]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Họ */}
      <div>
        <span className="font-medium">Họ:</span>
        <Input
          value={user.firstname}
          onChange={(e) => handleChange("firstname", e.target.value)}
          placeholder="Nhập họ"
        />
      </div>

      {/* Tên */}
      <div>
        <span className="font-medium">Tên:</span>
        <Input
          value={user.lastname}
          onChange={(e) => handleChange("lastname", e.target.value)}
          placeholder="Nhập tên"
        />
      </div>

      {/* Email */}
      <div>
        <span className="font-medium">Email:</span>
        <Input
          value={user.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Nhập email"
        />
      </div>

      {/* Số điện thoại */}
      <div>
        <span className="font-medium">Số điện thoại:</span>
        <Input
          value={user.mobile}
          onChange={(e) => handleChange("mobile", e.target.value)}
          placeholder="Nhập số điện thoại"
        />
      </div>

      {/* Chức vụ */}
      <div>
        <span className="font-medium">Chức vụ:</span>
        <Select
          value={
            user.role !== undefined && user.role !== null
              ? Number(user.role) // đảm bảo là number
              : undefined
          }
          onChange={(val) => handleChange("role", Number(val))}
          style={{ width: "100%" }}
          placeholder="Chọn chức vụ"
          options={roles.map((r) => ({
            label: r.value,       // hiển thị Admin/User
            value: Number(r.code) // code dạng number
          }))}
          showSearch
          optionFilterProp="label"
        />
      </div>

      {/* Trạng thái */}
      <div className="flex items-center gap-2">
        <span className="font-medium">Trạng thái:</span>
        <Switch
          checked={!!user.isBlocked}
          onChange={(val) => handleChange("isBlocked", val)}
          checkedChildren="Bị khoá"
          unCheckedChildren="Hoạt động"
        />
      </div>
    </div>
  );
};

export default UserForm;
