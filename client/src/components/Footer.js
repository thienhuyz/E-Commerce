import React from "react";
import { FaYoutube, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const Footer = () => {
    return (
        <div className="w-full bg-slate-100 text-[13px] text-gray-800">
            <div className="w-main mx-auto py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-[15px] font-semibold mb-3">Tổng đài hỗ trợ miễn phí</h3>
                    <p>
                        Mua hàng - bảo hành{" "}
                        <span className="font-semibold text-gray-900">1800.8888</span>{" "}
                        (7h30 - 22h00)
                    </p>
                    <p>
                        Khiếu nại{" "}
                        <span className="font-semibold text-gray-900">1800.8888</span>{" "}
                        (8h00 - 21h30)
                    </p>

                    <div className="mt-5 p-3 bg-gray-300 rounded">
                        <h4 className="text-[15px] font-semibold mb-1">
                            ĐĂNG KÝ NHẬN TIN KHUYẾN MÃI
                        </h4>
                        <p className="text-red-600 font-semibold">Nhận ngay voucher 10%</p>
                        <p className="text-gray-600">
                            Voucher sẽ được gửi sau 24h, chỉ áp dụng cho khách hàng mới
                        </p>
                    </div>
                </div>

                {/* Cột 2: Thông tin & chính sách */}
                <div className="ml-6">
                    <h3 className="text-[15px] font-semibold mb-3">Thông tin và chính sách</h3>
                    <ul className="space-y-2">
                        {[
                            "Mua hàng và thanh toán Online",
                            "Mua hàng trả góp Online",
                            "Mua hàng trả góp bằng thẻ tín dụng",
                            "Chính sách giao hàng",
                            "Chính sách đổi trả",
                            "Tra điểm Smember",
                            "Xem ưu đãi Smember",
                        ].map((item) => (
                            <li key={item} className="hover:text-red-600 cursor-pointer">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cột 3: Dịch vụ & thông tin khác */}
                <div className="ml-2">
                    <h3 className="text-[15px] font-semibold mb-3">Dịch vụ và thông tin khác</h3>
                    <ul className="space-y-2">
                        {[
                            "Khách hàng doanh nghiệp (B2B)",
                            "Ưu đãi thanh toán",
                            "Quy chế hoạt động",
                            "Chính sách bảo mật thông tin cá nhân",
                            "Chính sách Bảo hành",
                            "Liên hệ hợp tác kinh doanh",
                            "Tuyển dụng",
                        ].map((item) => (
                            <li key={item} className="hover:text-red-600 cursor-pointer">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cột 4: Kết nối + Website thành viên */}
                <div>
                    <h3 className="text-[15px] font-semibold mb-3">Kết nối với <span className="text-main">TechnoStore</span></h3>
                    <div className="flex gap-3 mb-5">
                        {[FaYoutube, FaFacebook, FaInstagram, FaTiktok, SiZalo].map(
                            (Icon, idx) => (
                                <a
                                    key={idx}
                                    className="flex h-10 w-10 items-center justify-center border border-gray-300 rounded hover:border-red-600 hover:bg-red-50"
                                    href="#"
                                >
                                    <Icon size={20} />
                                </a>
                            )
                        )}
                    </div>

                    <h3 className="text-[15px] font-semibold mb-3">Website thành viên</h3>
                    <div>
                        <p className="mb-2">Hệ thống bảo hành và chăm sóc Điện thoại - Máy tính</p>
                        <p className="mb-2">Trung tâm bảo hành uỷ quyền Apple</p>
                        <p className="mb-2">Trang thông tin công nghệ mới nhất</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
