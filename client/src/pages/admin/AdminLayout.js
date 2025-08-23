import React from "react";
import { Layout } from "antd";
import HeaderBar from "../../components/admin/HeaderBar";
import Sidebar from "../../components/admin/Sidebar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content className="m-4 p-4 bg-white rounded-lg shadow-sm">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
