import { Layout } from "antd";
import HeaderBar from "../../components/admin/HeaderBar";
import Sidebar from "../../components/admin/Sidebar";
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../utils/path'
import { useSelector } from 'react-redux'
const { Content } = Layout;

const AdminLayout = () => {
  const { isLoggedIn, current } = useSelector(state => state.user)
  if (!isLoggedIn || !current || +current.role !== 1111)
    return <Navigate to={`/${path.LOGIN}`} replace={true} />

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
  )
}

export default AdminLayout


