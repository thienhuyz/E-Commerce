import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetProducts } from "../apis/product";
import { Product } from "./";

const FeatureProducts = () => {
    const { categories } = useSelector((state) => state.app);
    const [categoryProducts, setCategoryProducts] = useState({});

    useEffect(() => {
        if (!categories?.length) return;

        (async () => {
            // Lấy title duy nhất
            const titles = [...new Set(categories.map(c => c?.title).filter(Boolean))];

            // Gọi API ngắn gọn theo từng category và ghép lại thành object
            const entries = await Promise.all(
                titles.map(async (title) => {
                    const res = await apiGetProducts({ category: title, limit: 4, sort: "-sold" });
                    return [title, res?.success ? res.products || [] : []];
                })
            );

            setCategoryProducts(Object.fromEntries(entries));
        })();
    }, [categories]);

    if (!categories?.length) return null;


    return (
        <div className="rounded-3xl px-2 py-2">
            {categories.map((category) => {
                const title = category?.title || "";
                const products = categoryProducts[title] || [];
                const brands = category?.brand || [];

                return (
                    <div key={category._id} className="mb-6">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between gap-8 py-2 border-b-2 border-main">
                                <span className="font-semibold capitalize text-2xl mx-4">
                                    SẢN PHẨM {title.toUpperCase()} NỔI BẬT NHẤT
                                </span>

                                <div className="flex flex-wrap gap-2 mx-4">
                                    {brands.map((brand) => (
                                        <button
                                            key={brand}
                                            type="button"
                                            className="px-6 py-2 text-base rounded-full border border-gray-300 hover:bg-gray-200 transition"
                                        // onClick={() => ...} // (nếu muốn lọc theo brand)

                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Grid sản phẩm */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {products.length > 0 ? (
                                products.map((el) => {
                                    const key = el._id
                                    return (
                                        <Product
                                            key={key}
                                            pid={key}
                                            productData={el}
                                            hideLabel
                                        />
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-sm text-gray-500">
                                    Chưa có sản phẩm.
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

    );
};

export default FeatureProducts;
