import { Route, Routes } from "react-router-dom";
import {
  Login,
  Home,
  Public,
  Products,
  FAQ,
  Services,
  DetailProduct,
  Blogs,
} from "./pages/public";
import path from "./utils/path";
import { getCategories } from "./store/app/asyncActions";
import { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import AdminLayout from "./pages/admin/AdminLayout";
import FinalRegister from "./pages/public/FinalRegister";
import ResetPassword from "./pages/public/ResetPassword";
import OrdersPage from "./pages/admin/OrdersPage";
import ProductsPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CouponsPage from "./pages/admin/CouponsPage";
import BrandsPage from "./pages/admin/BrandsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route
            path={path.DETAIL_PRODUCT__PID__TITLE}
            element={<DetailProduct />}
          />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />
        // Admin routes
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route
            path={path.ADMIN_DASHBOARD}
            element={<div>Admin Dashboard</div>}
          />
          <Route path={path.ADMIN_ORDERS} element={<OrdersPage />} />
          <Route path={path.ADMIN_PRODUCTS} element={<ProductsPage />} />
          <Route path={path.ADMIN_USERS} element={<UsersPage />} />
          <Route
            path={path.ADMIN_PRODUCT_CATEGORIES}
            element={<CategoriesPage />}
          />
          <Route path={path.ADMIN_COUPONS} element={<CouponsPage />} />
          <Route path={path.ADMIN_BRANDS} element={<BrandsPage />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Same as */}
      <ToastContainer />
    </div>
  );
}

export default App;
