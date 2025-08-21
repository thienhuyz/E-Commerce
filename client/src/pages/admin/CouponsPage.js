import React, { useEffect, useState } from "react";
import { message, Modal, Row, Col, Button } from "antd";
import {
  apiGetCoupons,
  apiCreateCoupon,
  apiUpdateCoupon,
  apiDeleteCoupon,
} from "../../apis/coupon";
import CouponTable from "../../components/admin/CouponTable";
import CouponForm from "../../components/admin/CouponForm";
import StatCard from "../../components/admin/StatCard";
import {
  TagOutlined,
  DollarOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await apiGetCoupons();
      console.log("Fetch coupons response:", res);
      setCoupons(res.coupons || []);
    } catch (err) {
      message.error("Failed to fetch coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async (values) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        expiry: values.expiry ? values.expiry.toISOString() : null,
      };

      if (editingCoupon) {
        await apiUpdateCoupon(editingCoupon._id, payload);
        message.success("Coupon updated successfully");
      } else {
        await apiCreateCoupon(payload);
        message.success("Coupon created successfully");
      }

      setModalOpen(false);
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) {
      message.error("Error saving coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (coupon) => {
    try {
      await apiDeleteCoupon(coupon._id);
      message.success("Coupon deleted");
      fetchCoupons();
    } catch (err) {
      message.error("Error deleting coupon");
    }
  };

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(
    (c) => c.expiry && dayjs(c.expiry).isAfter(dayjs())
  ).length;
  const inactiveCoupons = totalCoupons - activeCoupons;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Coupons</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingCoupon(null);
            setModalOpen(true);
          }}
        >
          Create Coupon
        </Button>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <StatCard
            title="Total Coupons"
            value={totalCoupons}
            icon={<TagOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col span={8}>
          <StatCard
            title="Active Coupons"
            value={activeCoupons}
            icon={<DollarOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col span={8}>
          <StatCard
            title="Inactive Coupons"
            value={inactiveCoupons}
            icon={<PercentageOutlined />}
            color="#ff4d4f"
          />
        </Col>
      </Row>

      <CouponTable
        dataSource={coupons}
        onEdit={(c) => {
          setEditingCoupon(c);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal
        title={editingCoupon ? "Edit Coupon" : "Create Coupon"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <CouponForm
          initialValues={{
            ...editingCoupon,
            expiry: editingCoupon?.expiry ? dayjs(editingCoupon.expiry) : null,
          }}
          onFinish={handleSave}
          onCancel={() => setModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default CouponsPage;
