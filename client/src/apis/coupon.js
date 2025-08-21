import axios from "../axios";

// Create new coupon
export const apiCreateCoupon = (couponData) =>
  axios({
    url: "/coupon",
    method: "post",
    data: couponData,
  });

// Update coupon
export const apiUpdateCoupon = (cid, couponData) =>
  axios({
    url: `/coupon/${cid}`,
    method: "put",
    data: couponData,
  });

// Delete coupon
export const apiDeleteCoupon = (cid) =>
  axios({
    url: `/coupon/${cid}`,
    method: "delete",
  });

// Get all coupons
export const apiGetCoupons = () =>
  axios({
    url: "/coupon",
    method: "get",
  });
