import axios from "../axios";

// Create new order
export const apiCreateOrder = (orderData) =>
  axios({
    url: "/order",
    method: "post",
    data: orderData,
  });

// Update order status (Admin only)
export const apiUpdateOrderStatus = (oid, statusData) =>
  axios({
    url: `/order/status/${oid}`,
    method: "post",
    data: statusData,
  });

// Get current user's orders
export const apiGetUserOrders = () =>
  axios({
    url: "/order",
    method: "get",
  });

// Get all orders (Admin only)
export const apiGetAllOrders = () =>
  axios({
    url: "/order/admin",
    method: "get",
  });
