import React from "react";
import { Input, Select, Switch } from "antd";

const { TextArea } = Input;

const UserForm = ({ user, onChange }) => {
  if (!user) return null;

  const handleChange = (field, value) => {
    onChange({ ...user, [field]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="font-medium">First name:</span>
        <Input
          value={user.firstname}
          onChange={(e) => handleChange("firstname", e.target.value)}
          placeholder="Enter first name"
        />
      </div>

      <div>
        <span className="font-medium">Last name:</span>
        <Input
          value={user.lastname}
          onChange={(e) => handleChange("lastname", e.target.value)}
          placeholder="Enter last name"
        />
      </div>

      <div>
        <span className="font-medium">Email:</span>
        <Input value={user.email} disabled />
      </div>

      <div>
        <span className="font-medium">Mobile:</span>
        <Input value={user.mobile} disabled />
      </div>

      <div>
        <span className="font-medium">Address:</span>
        <TextArea
          rows={2}
          value={user.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Enter address"
        />
      </div>

      <div>
        <span className="font-medium">Role:</span>
        <Select
          value={user.role}
          onChange={(val) => handleChange("role", val)}
          style={{ width: "100%" }}
        >
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-medium">Blocked:</span>
        <Switch
          checked={user.isBlocked}
          onChange={(val) => handleChange("isBlocked", val)}
        />
      </div>
    </div>
  );
};

export default UserForm;
