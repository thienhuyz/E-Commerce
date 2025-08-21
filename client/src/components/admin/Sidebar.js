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
      label: <Link to={path.ADMIN_DASHBOARD}>Dashboard</Link>,
    },
    {
      key: "2",
      icon: <ShoppingCartOutlined />,
      label: <Link to={path.ADMIN_ORDERS}>Orders</Link>,
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: <Link to={path.ADMIN_USERS}>Users</Link>,
    },
    {
      key: "4",
      icon: <GiftOutlined />,
      label: <Link to={path.ADMIN_COUPONS}>Coupons</Link>,
    },
    {
      key: "5",
      icon: <AppstoreOutlined />,
      label: <Link to={path.ADMIN_PRODUCTS}>Products</Link>,
    },
    {
      key: "6",
      icon: <FolderOpenOutlined />,
      label: <Link to={path.ADMIN_PRODUCT_CATEGORIES}>Categories</Link>,
    },
    {
      key: "9",
      icon: <StarOutlined />,
      label: <Link to={path.ADMIN_BRANDS}>Brands</Link>,
    },
    {
      key: "10",
      icon: <SettingOutlined />,
      label: <Link to={path.ADMIN_ROLES}>Admin Roles</Link>,
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
          <AntDesignOutlined style={{ fontSize: 28, color: "#16a34a" }} />
        ) : (
          <span style={{ color: "#16a34a" }}>DEALPORT</span>
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
