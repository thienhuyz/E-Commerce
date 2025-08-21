// src/components/admin/BrandForm.js
import React from "react";
import { Form, Input, Button } from "antd";

const BrandForm = ({ initialValues, onFinish, onCancel, loading }) => {
  return (
    <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item
        name="title"
        label="Brand Title"
        rules={[{ required: true, message: "Please enter brand title" }]}
      >
        <Input placeholder="Enter brand title" />
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

export default BrandForm;
