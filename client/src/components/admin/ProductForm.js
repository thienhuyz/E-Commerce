// src/components/admin/ProductForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Input, Select, Button, message, Upload, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

/**
 * Props:
 * - product: object | null
 * - categories: [{ _id, title, brand: string[] }]
 * - brands: [{ _id, title }]              // ✅ làm giống category
 * - onSubmit: (payload, productId) => Promise<void> | void
 * - onSuccess: () => void
 */
const ProductForm = ({ product, categories = [], brands = [], onSubmit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [thumbFile, setThumbFile] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Lưu category = _id ; brand = option value (ở đây dùng _id luôn cho đồng nhất)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: undefined,
    category: undefined, // _id
    brand: undefined,    // _id (thực chất là name), sẽ map -> string khi submit
    quantity: undefined,
    sold: undefined,
    color: "",
  });

  // Tìm _id category từ product.category (có thể là title hoặc _id)
  const resolveCategoryId = (prodCat) => {
    if (!prodCat) return undefined;
    const byId = categories.find((c) => c._id === prodCat);
    if (byId) return byId._id;
    const byTitle = categories.find((c) => c.title === prodCat);
    return byTitle?._id ?? undefined;
  };

  // Tìm option.brand._id từ product.brand (string)
  const resolveBrandId = (prodBrand) => {
    if (!prodBrand) return undefined;
    const opt = brands.find((b) => b._id === prodBrand || b.title === prodBrand);
    return opt?._id ?? undefined;
  };

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: Array.isArray(product.description)
          ? product.description.join("\n")
          : (product.description || ""),
        price: product.price ?? undefined,
        category: resolveCategoryId(product.category),
        brand: resolveBrandId(product.brand), // ✅ map về option value
        quantity: product.quantity ?? undefined,
        sold: product.sold ?? undefined,
        color: product.color || "",
      });

      setThumbFile(
        product.thumb
          ? [{ uid: "-1", name: "thumb.jpg", status: "done", url: product.thumb }]
          : []
      );

      setFileList(
        Array.isArray(product.images)
          ? product.images.map((img, idx) => ({
            uid: String(idx),
            name: `image-${idx}.jpg`,
            status: "done",
            url: img,
          }))
          : []
      );
    } else {
      // reset khi tạo mới
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
  }, [product, categories, brands]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!formData.title) { message.error("Tên sản phẩm là bắt buộc"); return; }
      if (formData.price === undefined || formData.price === null) { message.error("Giá là bắt buộc"); return; }
      if (!formData.category) { message.error("Danh mục là bắt buộc"); return; }
      if (!formData.brand) { message.error("Thương hiệu là bắt buộc"); return; }

      // description -> array
      const description = (formData.description || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      // ✅ Map brand option -> string (API cần string)
      const brandObj = brands.find((b) => b._id === formData.brand);
      const brand = brandObj?.title || formData.brand; // fallback nếu _id chính là name

      const payload = {
        ...formData,
        description,
        brand,            // string
      };

      await onSubmit?.(payload, product?._id);

      message.success(product?._id ? "Cập nhật sản phẩm thành công!" : "Tạo sản phẩm thành công!");
      onSuccess?.();
    } catch (err) {
      console.error("Save product error:", err);
      message.error(err?.message || "Lưu sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
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
        min={0}
      />

      <InputNumber
        placeholder="Số lượng"
        value={formData.quantity}
        onChange={(value) => handleChange("quantity", value)}
        style={{ marginBottom: 10, width: "100%" }}
        min={0}
      />

      <Input
        placeholder="Màu sắc"
        value={formData.color || ""}
        onChange={(e) => handleChange("color", e.target.value)}
        style={{ marginBottom: 10 }}
      />

      {/* Danh mục: như cũ, value là _id */}
      <Select
        placeholder="Danh mục"
        value={formData.category || undefined}
        onChange={(value) => handleChange("category", value)}
        style={{ marginBottom: 10, width: "100%" }}
        allowClear
        showSearch
        optionFilterProp="children"
      >
        {categories.map((c) => (
          <Select.Option key={c._id} value={c._id}>
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
        showSearch
        optionFilterProp="children"
      >
        {brands.map((b) => (
          <Select.Option key={b._id} value={b._id}>
            {b.title}
          </Select.Option>
        ))}
      </Select>

      {/* Thumb */}
      <Upload
        listType="picture-card"
        fileList={thumbFile}
        onChange={({ fileList }) => setThumbFile(fileList)}
        beforeUpload={() => false}
        maxCount={1}
      >
        {thumbFile.length < 1 && "Chọn ảnh thumb"}
      </Upload>

      {/* Images */}
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
