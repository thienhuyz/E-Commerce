import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  GiftOutlined,
  AppstoreOutlined,
  TagsOutlined,
  StarOutlined,
  SettingOutlined,
  AntDesignOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import path from "../../utils/path";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to={path.DASHBOARD}>Dashboard</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to={path.MANAGE_USER}>Users</Link>,
    },
    {
      key: "3",
      icon: <AppstoreOutlined />,
      label: <Link to={path.MANAGE_PRODUCTS}>Products</Link>,
    },
    {
      key: "4",
      icon: <ShoppingCartOutlined />,
      label: <Link to={path.MANAGE_ORDER}>Orders</Link>,
    },
  ];

  return (
    <Sider
      width={220}
      collapsedWidth={80}
      collapsed={collapsed}
      trigger={null}
      className="bg-white shadow-md"
      style={{ position: "relative" }}
    >
      {/* Header + Toggle */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "0" : "0 12px",
          fontWeight: "bold",
          fontSize: 18,
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {collapsed ? (
          <AntDesignOutlined style={{ fontSize: 28, color: "#DC1C31" }} />
        ) : (
          <span style={{ color: "#DC1C31" }} className="text-2xl">TechnoStore</span>
        )}
        <Button
          type="text"
          shape="circle"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
        style={{ border: "none" }}
      />
    </Sider>
  );
};

export default Sidebar;
