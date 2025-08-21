// src/pages/admin/BrandsPage.js
import React, { useEffect, useState } from "react";
import { Row, Col, Button, message, Modal } from "antd";
import StatCard from "../../components/admin/StatCard";
import BrandTable from "../../components/admin/BrandTable";
import BrandForm from "../../components/admin/BrandForm";
import { TagOutlined } from "@ant-design/icons";
import {
  apiGetBrands,
  apiCreateBrand,
  apiUpdateBrand,
  apiDeleteBrand,
} from "../../apis/brand";

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await apiGetBrands();
      setBrands(res.brands || []);
    } catch (err) {
      message.error("Failed to fetch brands");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSave = async (values) => {
    try {
      if (editingBrand) {
        await apiUpdateBrand(editingBrand._id, values);
        message.success("Brand updated successfully");
      } else {
        await apiCreateBrand(values);
        message.success("Brand created successfully");
      }
      setModalOpen(false);
      setEditingBrand(null);
      fetchBrands();
    } catch (err) {
      message.error("Error saving brand");
    }
  };

  const handleDelete = async (brand) => {
    try {
      await apiDeleteBrand(brand._id);
      message.success("Brand deleted successfully");
      fetchBrands();
    } catch (err) {
      message.error("Error deleting brand");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Brands</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingBrand(null);
            setModalOpen(true);
          }}
        >
          Create Brand
        </Button>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <StatCard
            title="Total Brands"
            value={brands.length}
            icon={<TagOutlined />}
            color="#1890ff"
          />
        </Col>
      </Row>

      <BrandTable
        dataSource={brands}
        onEdit={(b) => {
          setEditingBrand(b);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal
        title={editingBrand ? "Edit Brand" : "Create Brand"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <BrandForm
          initialValues={editingBrand}
          onFinish={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BrandsPage;
