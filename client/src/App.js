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
import { useEffect } from "react";
import { useDispatch } from "react-redux";

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
