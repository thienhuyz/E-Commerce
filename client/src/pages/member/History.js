import { apiGetUserOrders } from "../../apis";
import { CustomSelect, InputForm, Pagination } from "../../components";
import withBaseComponent from "../../hocs/withBaseComponent";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { statusOrders } from "../../utils/contants";

const CURRENCY = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
});

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    processing: "bg-blue-100 text-blue-800 ring-blue-200",
    shipped: "bg-indigo-100 text-indigo-800 ring-indigo-200",
    delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    canceled: "bg-rose-100 text-rose-800 ring-rose-200",
    cancelled: "bg-rose-100 text-rose-800 ring-rose-200",
    refunded: "bg-slate-100 text-slate-800 ring-slate-200",
};

const VI_STATUS = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đã gửi hàng",
    delivered: "Đã giao",
    canceled: "Đã hủy",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
};

const StatusPill = ({ value }) => {
    const key = (value || "").toLowerCase();
    const cls = STATUS_COLORS[key] || "bg-slate-100 text-slate-800 ring-slate-200";
    const label = VI_STATUS[key] || value || "—";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>
            {label}
        </span>
    );
};

const ProductCell = ({ products }) => {
    if (!products?.length) return <span className="text-slate-400">Không có sản phẩm</span>;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((item) => (
                <div className="flex items-center gap-3" key={item._id} title={item?.title}>
                    <img
                        src={item.thumbnail}
                        alt="Ảnh sản phẩm"
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200"
                        loading="lazy"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                        <p className="text-xs text-slate-500">
                            SL: <span className="text-slate-700 font-semibold">{item.quantity}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const History = ({ navigate, location }) => {
    const [orders, setOrders] = useState(null);
    const [counts, setCounts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [params] = useSearchParams();

    const {
        register,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            q: params.get("q") || "",
            status: params.get("status") || "",
        },
    });

    const q = watch("q");
    const status = watch("status");

    const fetchPOrders = async (queryParams) => {
        try {
            setIsLoading(true);
            const response = await apiGetUserOrders({
                ...queryParams,
                limit: process.env.REACT_APP_LIMIT,
            });
            if (response?.success) {
                setOrders(response.order);
                setCounts(response.counts);
            } else {
                setOrders([]);
                setCounts(0);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const queryFromURL = useMemo(() => Object.fromEntries([...params]), [params]);

    useEffect(() => {
        fetchPOrders(queryFromURL);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        const t = setTimeout(() => {
            const base = {
                ...(q ? { q } : {}),
                ...(status ? { status } : {}),
                page: "1",
            };
            navigate({ pathname: location.pathname, search: createSearchParams(base).toString() });
        }, 400);
        return () => clearTimeout(t);
    }, [q, status, navigate, location.pathname]);

    const handleSearchStatus = ({ value }) => {
        setValue("status", value || "");
    };

    const pageIndex = (() => {
        const page = Number(params.get("page") || 1);
        const limit = Number(process.env.REACT_APP_LIMIT || 7);
        return (page - 1) * limit;
    })();

    return (
        <div className="w-[1130px] mx-16 flex flex-col min-h-screen overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-gradient-to-b from-white to-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
                <div className="py-5 flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Lịch sử đơn hàng</h1>
                    <span className="text-sm text-slate-500 hidden sm:inline">Tổng: {counts}</span>
                </div>
                <div className="pb-4">
                    <form className="grid grid-cols-1 md:grid-cols-10 gap-3 md:gap-4">
                        <div className="md:col-span-6">
                            <InputForm
                                id="q"
                                register={register}
                                errors={errors}
                                fullWidth
                                placeholder="Tìm đơn theo sản phẩm, trạng thái..."
                                aria-label="Tìm kiếm đơn hàng"
                            />
                        </div>
                        <div className="md:col-span-4 flex items-center">
                            <CustomSelect
                                options={statusOrders}
                                value={status}
                                onChange={(val) => handleSearchStatus(val)}
                                wrapClassname="w-full"
                                placeholder="Lọc theo trạng thái"
                            />
                        </div>
                    </form>
                </div>
            </header>

            {/* Bảng dữ liệu */}
            <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-slate-200 shadow-sm bg-white flex-1">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                        <tr>
                            <th className="py-3.5 px-3 text-left font-semibold">STT</th>
                            <th className="py-3.5 px-3 text-left font-semibold">Sản phẩm</th>
                            <th className="py-3.5 px-3 text-right font-semibold">Tổng tiền</th>
                            <th className="py-3.5 px-3 text-center font-semibold">Trạng thái</th>
                            <th className="py-3.5 px-3 text-center font-semibold">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={5} className="px-3 py-10 text-center text-slate-500">
                                    Đang tải đơn hàng…
                                </td>
                            </tr>
                        )}
                        {!isLoading && (!orders || orders.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-3 py-16">
                                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                                        <div className="w-16 h-16 rounded-2xl ring-1 ring-slate-200 grid place-items-center">
                                            <span className="text-2xl">🧾</span>
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-900">Chưa có đơn phù hợp</h3>
                                        <p className="text-sm text-slate-500">Hãy thử thay đổi từ khóa hoặc bộ lọc.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!isLoading && orders?.map((el, idx) => (
                            <tr key={el._id} className="border-t border-slate-100 hover:bg-slate-50/60">
                                <td className="px-3 py-4 align-top text-slate-600">{pageIndex + idx + 1}</td>
                                <td className="px-3 py-4 align-top">
                                    <ProductCell products={el.products} />
                                </td>
                                <td className="px-3 py-4 align-top text-right font-semibold text-slate-900">
                                    {typeof el.total === "number" ? CURRENCY.format(el.total) : `${el.total} $`}
                                </td>
                                <td className="px-3 py-4 align-top text-center">
                                    <StatusPill value={el.status} />
                                </td>
                                <td className="px-3 py-4 align-top text-center text-slate-700">
                                    {el.createdAt ? moment(el.createdAt).format("DD/MM/YYYY") : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang cố định dưới cùng */}
            <div className="sticky bottom-0 left-0 w-full bg-white border-t border-slate-200 py-3 flex justify-end px-4">
                <Pagination totalCount={counts} />
            </div>
        </div>
    );
};

export default withBaseComponent(History);
