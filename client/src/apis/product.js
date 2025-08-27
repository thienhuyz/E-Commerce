import axios from '../axios';

export const apiGetProducts = (params) => axios({
    url: '/product/',
    method: 'get',
    params
});

export const apiGetProduct = (pid) =>
    axios({
        url: '/product/' + pid,
        method: 'get',
    })
export const apiRatings = (data) => axios({
    url: '/product/ratings',
    method: 'put',
    data
})
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

export const apiCreateOrder = (data) =>
    axios({
        url: '/order',
        method: 'post',
        data
    })
