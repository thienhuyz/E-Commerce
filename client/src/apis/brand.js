import axios from "../axios";

// Lấy tất cả brand
export const apiGetBrands = () =>
    axios({
        url: "/brand",
        method: "get",
    });

// Tạo brand mới
export const apiCreateBrand = (data) =>
    axios({
        url: "/brand",
        method: "post",
        data,
    });

// Cập nhật brand
export const apiUpdateBrand = (bid, data) =>
    axios({
        url: "/brand/" + bid,
        method: "put",
        data,
    });

// Xóa brand
export const apiDeleteBrand = (bid) =>
    axios({
        url: "/brand/" + bid,
        method: "delete",
    });