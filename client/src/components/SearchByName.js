// src/pages/SearchByName.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiGetProducts } from "../apis/product";

const SearchByName = () => {
    const { search } = useLocation(); // querystring
    const params = new URLSearchParams(search);
    const keyword = (params.get("title") || "").trim();

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [counts, setCounts] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!keyword) {
            setList([]); setCounts(0); setError("");
            return;
        }
        let ignore = false;
        setLoading(true); setError("");

        apiGetProducts({ title: keyword, limit: 50 })
            .then((res) => {
                const payload = res?.data ?? res;
                const ok = payload?.success === true;
                if (!ok) {
                    setError(payload?.message || "Không tải được kết quả.");
                    setList([]); setCounts(0);
                    return;
                }
                setList(payload.products || []);
                setCounts(payload.counts || 0);
            })
            .catch((e) => setError(e?.response?.data?.message || e?.message || "Lỗi kết nối."))
            .finally(() => setLoading(false));


        return () => { ignore = true; };
    }, [keyword]);

    if (!keyword) return (
        <div className="w-full flex justify-center">
            <div className="w-main py-8 text-center text-gray-600">
                Nhập tên sản phẩm vào ô tìm kiếm ở header.
            </div>
        </div>
    );

    return (
        <div className="w-full flex justify-center">
            <div className="w-main py-6">
                <h2 className="text-xl font-semibold mb-4">
                    Kết quả cho “{keyword}”
                    {counts ? <span className="ml-2 text-gray-600">({counts})</span> : null}
                </h2>

                {loading && <div className="py-10 text-center">Đang tải…</div>}
                {!!error && <div className="py-10 text-center text-red-500">{error}</div>}

                {!loading && !error && (
                    list.length ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {list.map(p => (
                                <div key={p._id} className="border rounded-lg p-3">
                                    <div className="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
                                        {p?.thumb && <img src={p.thumb} alt={p.title} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="font-medium line-clamp-2">{p.title}</div>
                                    {p?.price != null && (
                                        <div className="mt-1 text-red-600 font-semibold">
                                            {p.price.toLocaleString()}₫
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-gray-600">
                            Không tìm thấy sản phẩm phù hợp.
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchByName;
