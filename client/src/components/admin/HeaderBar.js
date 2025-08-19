import React from "react";
import { Layout, Input, Avatar } from "antd";
import { SearchOutlined, BellOutlined } from "@ant-design/icons";

const { Header } = Layout;

const HeaderBar = () => {
  return (
    <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
      {/* Search */}
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search data, users, or reports"
        className="w-1/3"
      />

      {/* Icon + Avatar */}
      <div className="flex items-center gap-4">
        <BellOutlined className="text-lg" />
        <Avatar src="https://i.pravatar.cc/40" />
      </div>
    </Header>
  );
};

export default HeaderBar;
