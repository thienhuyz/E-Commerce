// src/pages/admin/ProductsPage.jsx
import { useEffect, useState } from "react";
import { apiGetProducts, apiDeleteProduct } from "../../apis/product";

import StatCard from "../../components/admin/StatCard";
import FilterBar from "../../components/admin/FilterBar";
import ProductTable from "../../components/admin/ProductTable";
import ProductForm from "../../components/admin/ProductForm";
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FireOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, message, Modal } from "antd";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    outOfStock: 0,
    bestSellers: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});



  // Load products
  const fetchProducts = async (page = 1, pageSize = 10, extraFilters = {}) => {
    try {
      const params = { page, limit: pageSize, ...extraFilters };
      const res = await apiGetProducts(params);

      if (res?.success) {
        const data = res.products || [];
        setProducts(data);
        setPagination({
          current: page,
          pageSize,
          total: res.counts || data.length,
        });

        const total = res.counts || data.length;
        const inStock = data.filter((p) => p.quantity > 0).length;
        const outOfStock = data.filter((p) => p.quantity === 0).length;
        const bestSellers = data.filter((p) => p.sold > 100).length;
        setStats({ total, inStock, outOfStock, bestSellers });
      }
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách sản phẩm");
    }
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize, filters);
  }, []);

  // Filter
  const handleFilter = (filterValues) => {
    const params = {};
    if (filterValues.category) params.category = filterValues.category;
    if (filterValues.inStock === true) params.quantity_gte = 1;
    if (filterValues.inStock === false) params.quantity_lte = 0;
    if (filterValues.priceRange) {
      params.price_gte = filterValues.priceRange[0];
      params.price_lte = filterValues.priceRange[1];
    }
    if (filterValues.sort) params.sort = filterValues.sort;

    setFilters(params);
    fetchProducts(1, pagination.pageSize, params);
  };

  // Pagination
  const handleTableChange = (pag) => {
    setPagination(pag);
    fetchProducts(pag.current, pag.pageSize, filters);
  };

  // Add / Edit
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = async (product) => {
    try {
      const res = await apiDeleteProduct(product._id);
      console.log("Response xóa sản phẩm:", res);

      if (res.success) {
        message.success(`Xóa sản phẩm "${res.productData.title}" thành công!`);
        fetchProducts(pagination.current, pagination.pageSize, filters);
      } else {
        message.error(res.productData || "Xóa sản phẩm thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      message.error(
        err.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm!"
      );
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Quản lý sản phẩm</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddProduct}
        >
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Tổng sản phẩm"
          value={stats.total}
          icon={<ShoppingOutlined />}
          color="#1890ff"
        />
        <StatCard
          title="Còn hàng"
          value={stats.inStock}
          icon={<CheckCircleOutlined />}
          color="#52c41a"
        />
        <StatCard
          title="Hết hàng"
          value={stats.outOfStock}
          icon={<CloseCircleOutlined />}
          color="#ff4d4f"
        />
        <StatCard
          title="Bán chạy"
          value={stats.bestSellers}
          icon={<FireOutlined />}
          color="#fa8c16"
        />
      </div>

      {/* FilterBar */}

      {/* ProductTable */}
      <ProductTable
        dataSource={products}
        pagination={pagination}
        onChange={handleTableChange}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Modal Add/Edit */}
      <Modal
        title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <ProductForm
          product={editingProduct}

          onSuccess={() => {
            setIsModalVisible(false);
            fetchProducts(pagination.current, pagination.pageSize, filters);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProductsPage;