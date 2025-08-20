import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const Banner = () => {
    return (
        <div className="w-full rounded-3xl overflow-hidden shadow-xl"> {/* Bo góc và ẩn phần ảnh vượt quá */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={50} // Khoảng cách giữa các slide
                slidesPerView={1} // Số lượng slide hiển thị mỗi lần
                navigation // Hiển thị nút next/prev
                pagination={{ clickable: true }} // Cho phép click vào các điểm pagination
                autoplay={{
                    delay: 3000, // Thời gian chuyển động giữa các slide (ms)
                    disableOnInteraction: false, // Cho phép autoplay sau khi người dùng tương tác
                }}
                loop={true} // Cho phép lặp lại vòng carousel
            >
                <SwiperSlide>
                    <div className="h-full w-full">
                        <img
                            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/home-xm6-mua.jpg"
                            alt="banner-1"
                            className="h-[400px] w-full object-cover"
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="h-full  w-full">
                        <img
                            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/fujiii.jpg"
                            alt="banner-2"
                            className="h-[400px] w-full object-cover"
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="h-full  w-full">
                        <img
                            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/oppo-reno14-f-Sliding-0825.png"
                            alt="banner-3"
                            className="h-[400px] w-full object-cover"
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="h-full  w-full">
                        <img
                            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/Sliding-Xiaomi-home-2.jpg"
                            alt="banner-4"
                            className="h-[400px] w-full object-cover"
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="h-full  w-full">
                        <img
                            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/copoassushome.png"
                            alt="banner-5"
                            className="h-[400px] w-full object-cover"
                        />
                    </div>
                </SwiperSlide>
            </Swiper>
            <style jsx>{`
                    .swiper-button-next, .swiper-button-prev {
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s;
                background-color: rgba(0, 0, 0, 0.5); /* Nền đen nhạt */
                color: white; /* Màu chữ trắng */
                border-radius: 50%; /* Tạo hình tròn */
                width: 60px; /* Chiều rộng nút lớn hơn */
                height: 60px; /* Chiều cao nút lớn hơn */
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 28px; /* Kích thước icon lớn hơn */
            }

            /* Khi hover vào vùng swiper, nút hiển thị */
            .swiper:hover .swiper-button-next,
            .swiper:hover .swiper-button-prev {
                opacity: 1;
                visibility: visible;
            }

            /* Tùy chỉnh kích thước icon mũi tên */
            .swiper-button-next::after,
            .swiper-button-prev::after {
                font-size: 28px; /* Icon lớn hơn */
            }
            `}</style>
        </div>
    );
};

export default Banner;
