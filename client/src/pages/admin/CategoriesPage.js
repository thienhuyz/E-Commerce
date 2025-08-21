import React, { useEffect, useState } from "react";
import { Row, Col, Button, message, Modal } from "antd";
import CategoryTable from "../../components/admin/CategoryTable";
import CategoryForm from "../../components/admin/CategoryForm";
import { TagOutlined } from "@ant-design/icons";
import StatCard from "../../components/admin/StatCard";
import {
  apiGetCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
} from "../../apis/category";
import { apiGetBrands } from "../../apis/brand";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Fetch categories ---
  const fetchCategories = async () => {
    try {
      const res = await apiGetCategories();
      console.log("Categories API response:", res); // <-- log đây
      setCategories(res.prodCategories || []); // dùng key đúng từ API
    } catch (err) {
      console.error("Fetch categories error:", err); // <-- log lỗi
      message.error("Failed to fetch categories");
    }
  };

  // --- Fetch brands ---
  const fetchBrands = async () => {
    try {
      const res = await apiGetBrands();
      console.log("Brands API response:", res); // <-- log đây
      setBrands(res.brands || []);
    } catch (err) {
      console.error("Fetch brands error:", err); // <-- log lỗi
      message.error("Failed to fetch brands");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // --- Save category ---
  const handleSave = async (values) => {
    try {
      setLoading(true);
      if (editingCategory) {
        await apiUpdateCategory(editingCategory._id, values);
        message.success("Category updated successfully");
      } else {
        await apiCreateCategory(values);
        message.success("Category created successfully");
      }
      setModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      message.error("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete category ---
  const handleDelete = async (category) => {
    try {
      await apiDeleteCategory(category._id);
      message.success("Category deleted");
      fetchCategories();
    } catch (err) {
      message.error("Error deleting category");
    }
  };

  const totalCategories = categories.length; // khai báo trước khi dùng

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Categories</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
        >
          Create Category
        </Button>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <StatCard
            title="Total Categories"
            value={totalCategories}
            icon={<TagOutlined />}
          />
        </Col>
      </Row>

      <CategoryTable
        dataSource={categories}
        onEdit={(cat) => {
          setEditingCategory(cat);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Create Category"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <CategoryForm
          initialValues={editingCategory}
          onFinish={handleSave}
          onCancel={() => setModalOpen(false)}
          brands={brands}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default CategoriesPage;
