// src/components/admin/CategoryForm.js
import React from "react";
import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

const CategoryForm = ({
  initialValues,
  onFinish,
  onCancel,
  brands = [],
  loading,
}) => {
  return (
    <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item
        name="title"
        label="Category Title"
        rules={[{ required: true, message: "Please enter category title" }]}
      >
        <Input placeholder="Enter category title" />
      </Form.Item>

      <Form.Item
        name="brand"
        label="Brands"
        rules={[{ required: true, message: "Please select brands" }]}
      >
        <Select mode="multiple" placeholder="Select brands" allowClear>
          {brands.map((b) => (
            <Option key={b._id || b} value={b._id || b}>
              {b.title || b}
            </Option>
          ))}
        </Select>
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

export default CategoryForm;
