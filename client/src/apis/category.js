import axios from "../axios"; // axios instance bạn cấu hình sẵn

// Lấy tất cả category
export const apiGetCategories = () =>
    axios({
        url: "/prodcategory",
        method: "get",
    });

// Tạo category mới
export const apiCreateCategory = (data) =>
    axios({
        url: "/prodcategory",
        method: "post",
        data,
    }).then((res) => res.data);

// Cập nhật category
export const apiUpdateCategory = (cid, data) =>
    axios({
        url: `/prodcategory/${cid}`,
        method: "put",
        data,
    }).then((res) => res.data);

// Xóa category
export const apiDeleteCategory = (cid) =>
    axios({
        url: `/prodcategory/${cid}`,
        method: "delete",
    }).then((res) => res.data);