// src/apis/product.js
import axios from "../axios";

// Lấy danh sách sản phẩm (có thể phân trang, filter...)
export const apiGetProducts = (params) =>
  axios({
    url: "/product/",
    method: "get",
    params,
  });

// Lấy chi tiết 1 sản phẩm
export const apiGetProduct = (pid) =>
  axios({
    url: "/product/" + pid,
    method: "get",
  });

// Tạo mới sản phẩm (admin)
export const apiCreateProduct = (data) =>
  axios({
    url: "/product/",
    method: "post",
    data,
  });

// Cập nhật sản phẩm (admin)
export const apiUpdateProduct = (pid, data) =>
  axios({
    url: "/product/" + pid,
    method: "put",
    data,
  });

// Xóa sản phẩm (admin)
export const apiDeleteProduct = (pid) =>
  axios({
    url: "/product/" + pid,
    method: "delete",
  }).then((res) => res.data); // <- trả về res.data, chứa { success, productData }

// Upload nhiều ảnh cho sản phẩm (admin)
export const apiUploadProductImages = (pid, data) =>
  axios({
    url: "/product/uploadimage/" + pid,
    method: "put",
    data, // formData chứa images[]
    headers: { "Content-Type": "multipart/form-data" },
  });

// Người dùng đánh giá sản phẩm
export const apiRatingProduct = (data) =>
  axios({
    url: "/product/ratings",
    method: "put",
    data,
  });
