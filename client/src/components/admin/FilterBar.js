// src/components/admin/FilterBar.js
import React, { useState } from "react";
import { Select, Radio, Button } from "antd";

const { Option } = Select;

const FilterBar = ({ categories = [], onFilter }) => {
  const [category, setCategory] = useState(""); // default là empty string
  const [stockStatus, setStockStatus] = useState(null); // 'in', 'out', null
  const [sortBy, setSortBy] = useState(null); // 'price', 'sold', 'quantity'

  const handleApply = () => {
    const filterObj = {
      category: category || undefined, // nếu empty string thì không gửi
      inStock:
        stockStatus === "in" ? true : stockStatus === "out" ? false : undefined,
      sort: sortBy,
    };
    onFilter(filterObj);
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm flex-wrap">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Category */}
        <Select
          placeholder="Chọn danh mục"
          style={{ width: 180 }}
          value={category || undefined}
          onChange={setCategory}
          allowClear
        >
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Option key={cat.title} value={cat.title}>
                {cat.title}
              </Option>
            ))
          ) : (
            <Option disabled>Không có danh mục</Option>
          )}
        </Select>

        {/* Stock status */}
        <Radio.Group
          onChange={(e) => setStockStatus(e.target.value)}
          value={stockStatus}
        >
          <Radio value={null}>Tất cả</Radio>
          <Radio value="in">Còn hàng</Radio>
          <Radio value="out">Hết hàng</Radio>
        </Radio.Group>

        {/* Sort by */}
        <Select
          placeholder="Sắp xếp theo"
          style={{ width: 180 }}
          value={sortBy || undefined}
          onChange={setSortBy}
          allowClear
        >
          <Option value="price">Giá tăng</Option>
          <Option value="-price">Giá giảm</Option>
          <Option value="sold">Bán chạy</Option>
          <Option value="-sold">Bán chậm</Option>
          <Option value="quantity">Số lượng tăng</Option>
          <Option value="-quantity">Số lượng giảm</Option>
        </Select>
      </div>

      <Button type="primary" onClick={handleApply}>
        Áp dụng
      </Button>
    </div>
  );
};

export default FilterBar;
