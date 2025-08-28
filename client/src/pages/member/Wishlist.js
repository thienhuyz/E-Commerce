import { useSelector } from "react-redux"
import { Product } from "../../components"

const Wishlist = () => {
    const { current } = useSelector((s) => s.user)
    const items = current?.wishlist || []

    return (
        <div className="w-[1130px] mx-16 flex flex-col min-h-screen overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-gradient-to-b from-white to-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
                <div className="py-5 flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                        Sản phẩm yêu thích
                    </h1>
                    <span className="text-sm text-slate-500 hidden sm:inline">Tổng: {items.length}</span>
                </div>
            </header>

            {/* Vùng nội dung */}
            <div className="mt-4 rounded-2xl ring-1 ring-slate-200 shadow-sm bg-white">
                {items.length === 0 ? (
                    <div className="px-6 py-16">
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                            <div className="w-16 h-16 rounded-2xl ring-1 ring-slate-200 grid place-items-center">
                                <span className="text-2xl">💙</span>
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">Danh sách yêu thích trống</h3>
                            <p className="text-sm text-slate-500">Hãy thêm vài sản phẩm để xem lại sau.</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 sm:p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {items.map((el) => (
                                <div key={el._id} className="rounded-xl">
                                    <Product pid={el._id} productData={el} hideLabel />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer sticky (tuỳ chọn để giữ layout đồng bộ) */}
            <div className="sticky bottom-0 left-0 w-full bg-white border-t border-slate-200 py-3" />
        </div>
    )
}

export default Wishlist
