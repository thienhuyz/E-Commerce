import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetProduct } from '../../apis';
import { Breadcrumb, SelectQuantity, Button } from '../../components';
import Slider from "react-slick";
import { formatMoney, renderStarFromNumber, createslug } from '../../utils/helper';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
};

const DetailProduct = () => {
    const navigate = useNavigate();
    const { pid, title, category } = useParams();
    const [product, setProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);

    // [THÊM] helper: slug -> Title Case
    const slugToTitle = useCallback(
        (s) => s?.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        []
    );

    // [THÊM] Tiêu đề/breadcrumb hiển thị: ưu tiên dữ liệu thật từ server
    const displayTitle = useMemo(
        () => product?.title || slugToTitle(title),
        [product, title, slugToTitle]
    );
    const displayCategory = useMemo(
        () => product?.category || (category ? slugToTitle(category) : "Sản phẩm"),
        [product, category, slugToTitle]
    );

    // Tách màu "Xanh, Đen, Xám" -> ["Xanh", "Đen", "Xám"]
    const colors = useMemo(() => {
        return product?.color ? product.color.split(",").map(c => c.trim()) : [];
    }, [product]);

    // Fetch + set mặc định ảnh/màu
    useEffect(() => {
        let canceled = false;

        const fetchProductData = async () => {
            if (!pid) return;
            const res = await apiGetProduct(pid);
            if (!canceled && res?.success) {
                const p = res.productData;
                setProduct(p);

                // Ảnh & màu mặc định
                const firstImage = p?.thumb || p?.images?.[0] || "";
                setCurrentImage(firstImage);
                const firstColor = p?.color ? p.color.split(",").map(c => c.trim())[0] : "";
                setSelectedColor(firstColor || "");

                // [TUỲ CHỌN] Chuẩn hoá URL về slug canonical nếu user vào bằng tên có dấu
                const canonical = `/${createslug(p.category)}/${pid}/${createslug(p.title)}`;
                const current = `/${category}/${pid}/${title}`;
                if (category && title && canonical !== current) {
                    navigate(canonical, { replace: true });
                }
            }
        };

        fetchProductData();
        return () => { canceled = true; };
    }, [pid, category, title, navigate]);

    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) return;
        setQuantity(number);
    }, []);

    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return;
        if (flag === 'minus') setQuantity(prev => +prev - 1);
        if (flag === 'plus') setQuantity(prev => +prev + 1);
    }, [quantity]);

    return (
        <div>
            {/* [SỬA] dùng displayTitle/displayCategory để breadcrumb luôn đẹp và đúng */}
            <Breadcrumb title={displayTitle} category={displayCategory} />

            <div className="w-main m-auto mt-4 flex">
                {/* Left - image + Description */}
                <div className="flex flex-col gap-4 w-1/2 mr-12 rounded-xl">
                    <div className="border w-full justify-items-center rounded-xl shadow-lg">
                        <img
                            src={currentImage || 'https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png'}
                            alt={displayTitle}
                            className="h-[324px] object-cover"
                        />
                    </div>

                    {/* Slider ảnh nhỏ */}
                    <div className="w-full">
                        <Slider {...settings} className="detail ">
                            {product?.images?.map((el, i) => (
                                <div key={i} className="px-2 ">
                                    <img
                                        src={el}
                                        alt="sub-product"
                                        onClick={() => setCurrentImage(el)}
                                        className={`h-[82px] object-cover rounded-xl border shadow-lg cursor-pointer 
${currentImage === el ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <h2 className="text-lg font-semibold ">Thông số kỹ thuật</h2>

                    <div className="rounded-xl border border-gray-300 overflow-hidden w-full mb-4">
                        <table className="table-auto w-full ">
                            <tbody>
                                {product?.description?.map((line, i) => {
                                    const [label, value] = line.split(":");
                                    return (
                                        <tr key={i} className="border-b border-gray-300 last:border-b-0">
                                            <td className="p-3 font-semibold w-1/2 bg-gray-100 border-r border-gray-300">
                                                {label}
                                            </td>
                                            <td className="p-3">{value?.trim()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right - Options + Price */}
                <div className="flex-col justify-start items-center w-1/2 ml-8">
                    <div className='flex items-center mb-4 mx-2'>
                        <h1 className="text-2xl font-bold text-gray-800 ">{displayTitle}</h1> {/* [SỬA] */}
                    </div>

                    <div className='flex items-center mb-4 mx-2'>
                        {renderStarFromNumber(product?.totalRatings, 24)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                        <span className="text-base italic text-main ml-4">{`(Đã bán: ${product?.sold} sản phẩm)`}</span>
                    </div>

                    {/* Price */}
                    <div className="w-[210px] [caret-color:transparent] inline-block rounded-xl border border-[#115ccb] bg-gradient-to-r from-[#ffffff] to-[#ecf2ff] p-4">
                        <h3 className="text-lg font-semibold mb-1 mx-2">Giá sản phẩm</h3>
                        <span className="text-2xl font-bold text-red-600 mx-2">
                            {`${formatMoney(product?.price)}đ`}
                        </span>
                    </div>

                    {/* Color Options */}
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold my-4">Màu sắc sản phẩm</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {colors.map((color, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setSelectedColor(color);
                                        if (product?.images?.[i]) setCurrentImage(product.images[i]);
                                    }}
                                    className={`relative flex items-center gap-2 p-3 border rounded-md text-sm
${selectedColor === color
                                            ? "border-red-500 text-red-600 font-semibold"
                                            : "border-gray-300 text-gray-700"}`}
                                >
                                    {selectedColor === color && (
                                        <span className="absolute h-[16px] w-[16px] -top-0 -right-0 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-tr-[5px] rounded-bl-[5px]">
                                            ✓
                                        </span>
                                    )}
                                    <img
                                        src={product?.images?.[i]}
                                        alt={color}
                                        className="h-[40px] w-[40px] object-cover rounded"
                                    />
                                    <div className="flex flex-col text-left">
                                        <strong className="font-bold">{color}</strong>
                                        <span>{`${formatMoney(product?.price)}đ`}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Promotions */}
                    <div className="mt-6 rounded-2xl border border-blue-300/70 bg-blue-50 p-5 shadow-sm">
                        {/* ...giữ nguyên nội dung khuyến mãi... */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-red-400 text-white shadow">
                                🎁
                            </span>
                            <h3 className="text-lg font-bold text-gray-800">Khuyến mãi hấp dẫn</h3>
                        </div>
                        <ul className="space-y-3 text-[15px] text-gray-700">
                            <li className="flex gap-3">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                <span>Trả góp 0% lãi suất, tối đa 12 tháng, trả trước từ 10% qua CTTC hoặc 0đ qua thẻ tín dụng <a className="text-blue-600 hover:underline ml-1">Xem chi tiết</a></span>
                            </li>
                            <li className="flex gap-3">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                <span>Tặng combo 3 voucher tổng trị giá đến 2 triệu mua các sản phẩm tivi, gia dụng, đồng hồ trẻ em <a className="text-blue-600 hover:underline ml-1">Xem chi tiết</a></span>
                            </li>
                            <li className="flex gap-3">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                <span>Tặng Sim/Esim Viettel 5G có 8GB data/ngày kèm TV360 4K – miễn phí 1 tháng sử dụng (Chỉ áp dụng tại cửa hàng) <a className="text-blue-600 hover:underline ml-1">Xem chi tiết</a></span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col mt-6'>
                        <SelectQuantity
                            quantity={quantity}
                            handleQuantity={handleQuantity}
                            handleChangeQuantity={handleChangeQuantity}
                        />
                        <Button fw>Thêm vào giỏ hàng</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailProduct;
