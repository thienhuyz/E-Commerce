import React from "react";
import { Form, Input, InputNumber, DatePicker, Button } from "antd";

const CouponForm = ({ initialValues, onFinish, onCancel, loading }) => {
  return (
    <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Coupon Code"
        rules={[{ required: true, message: "Please enter coupon code" }]}
      >
        <Input placeholder="Enter coupon code" />
      </Form.Item>

      <Form.Item
        name="discount"
        label="Discount (%)"
        rules={[{ required: true, message: "Please enter discount" }]}
      >
        <InputNumber min={1} max={100} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="expiry"
        label="Expiry Date"
        rules={[{ required: true, message: "Please select expiry date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <div className="flex gap-2 justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default CouponForm;
