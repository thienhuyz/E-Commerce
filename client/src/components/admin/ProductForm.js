// src/components/admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { Input, Select, Button, message, Upload, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  apiCreateProduct,
  apiUpdateProduct,
  apiUploadProductImages,
} from "../../apis/product";

const { TextArea } = Input;

const ProductForm = ({ product, categories = [], brands = [], onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [thumbFile, setThumbFile] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: undefined,
    category: undefined,
    brand: undefined,
    quantity: undefined,
    sold: undefined,
    color: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description?.join("\n") || "",
        price: product.price ?? undefined,
        category: product.category || undefined,
        brand: product.brand || undefined,
        quantity: product.quantity ?? undefined,
        sold: product.sold ?? undefined,
        color: product.color || "",
      });

      if (product.thumb) {
        setThumbFile([
          { uid: "-1", name: "thumb.jpg", status: "done", url: product.thumb },
        ]);
      }

      if (product.images?.length) {
        setFileList(
          product.images.map((img, idx) => ({
            uid: String(idx),
            name: `image-${idx}.jpg`,
            status: "done",
            url: img,
          }))
        );
      }
    } else {
      setFormData({
        title: "",
        description: "",
        price: undefined,
        category: undefined,
        brand: undefined,
        quantity: undefined,
        sold: undefined,
        color: "",
      });
      setThumbFile([]);
      setFileList([]);
    }
  }, [product]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // validate
      if (!formData.title) return message.error("Tên sản phẩm là bắt buộc");
      if (!formData.price && formData.price !== 0)
        return message.error("Giá là bắt buộc");
      if (!formData.category) return message.error("Danh mục là bắt buộc");
      if (!formData.brand) return message.error("Thương hiệu là bắt buộc");

      // Xử lý description: tách theo line breaks thực sự
      let descArray = [];
      if (formData.description) {
        // tách theo \r\n hoặc \n hoặc \r
        descArray = formData.description
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
      }

      const payload = { ...formData, description: descArray };

      console.log("Payload description array:", payload.description);

      let res;
      if (product?._id) {
        res = await apiUpdateProduct(product._id, payload);
      } else {
        res = await apiCreateProduct(payload);
      }

      if (res?.success) {
        const pid = product?._id || res.createProduct?._id;
        // upload images...
        message.success(
          product?._id
            ? "Cập nhật sản phẩm thành công!"
            : "Tạo sản phẩm thành công!"
        );
        onSuccess?.();
      } else {
        message.error(res?.message || "Lưu sản phẩm thất bại!");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      message.error("Có lỗi xảy ra: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <Input
        placeholder="Tên sản phẩm"
        value={formData.title || ""}
        onChange={(e) => handleChange("title", e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <TextArea
        placeholder="Mô tả (mỗi dòng 1 mục)"
        value={formData.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
        rows={4}
        style={{ marginBottom: 10 }}
      />
      <InputNumber
        placeholder="Giá"
        value={formData.price}
        onChange={(value) => handleChange("price", value)}
        style={{ marginBottom: 10, width: "100%" }}
      />
      <InputNumber
        placeholder="Số lượng"
        value={formData.quantity}
        onChange={(value) => handleChange("quantity", value)}
        style={{ marginBottom: 10, width: "100%" }}
      />
      <InputNumber
        placeholder="Đã bán"
        value={formData.sold}
        onChange={(value) => handleChange("sold", value)}
        style={{ marginBottom: 10, width: "100%" }}
      />
      <Input
        placeholder="Màu sắc"
        value={formData.color || ""}
        onChange={(e) => handleChange("color", e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Select
        placeholder="Danh mục"
        value={formData.category || undefined}
        onChange={(value) => handleChange("category", value)}
        style={{ marginBottom: 10, width: "100%" }}
        allowClear
      >
        {categories.map((c) => (
          <Select.Option key={c._id} value={c.title}>
            {c.title}
          </Select.Option>
        ))}
      </Select>

      <Select
        placeholder="Thương hiệu"
        value={formData.brand || undefined}
        onChange={(value) => handleChange("brand", value)}
        style={{ marginBottom: 10, width: "100%" }}
        allowClear
      >
        {brands.map((b) => (
          <Select.Option key={b._id} value={b.title}>
            {b.title}
          </Select.Option>
        ))}
      </Select>

      <Upload
        listType="picture-card"
        fileList={thumbFile}
        onChange={({ fileList }) => setThumbFile(fileList)}
        beforeUpload={() => false}
        maxCount={1}
      >
        {thumbFile.length < 1 && "Chọn ảnh thumb"}
      </Upload>

      <Upload
        multiple
        listType="picture"
        fileList={fileList}
        onChange={({ fileList }) => setFileList(fileList)}
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />}>Chọn ảnh chi tiết</Button>
      </Upload>

      <Button
        type="primary"
        loading={loading}
        onClick={handleSubmit}
        style={{ marginTop: 15 }}
      >
        {product?._id ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
      </Button>
    </div>
  );
};

export default ProductForm;
