import { Button } from '../../components'
import withBaseComponent from '../../hocs/withBaseComponent'
import { useSelector } from 'react-redux'
import { formatMoney } from '../../utils/helper'
import path from '../../utils/path'
import Swal from 'sweetalert2'
import { createSearchParams } from 'react-router-dom'

const CURRENCY = (v) => `${formatMoney(v)} VND`

const DetailCart = ({ navigate, location }) => {
    const { currentCart, current } = useSelector(state => state.user)

    const handleSubmit = () => {
        if (!current?.address)
            return Swal.fire({
                icon: 'info',
                title: 'Rất tiếc!',
                text: 'Cập nhật địa chỉ trước khi thanh toán',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Cập nhật',
                cancelButtonText: 'Quay lại',
            }).then((result) => {
                if (result.isConfirmed)
                    navigate({
                        pathname: `/${path.MEMBER}/${path.PERSONAL}`,
                        search: createSearchParams({ redirect: location.pathname }).toString(),
                    })
            })
        else window.open(`/${path.CHECKOUT}`, '_blank')
    }

    const itemTotal = (el) => (+el?.price || 0) * (+el?.quantity || 0)
    const grandTotal = currentCart?.reduce((sum, el) => sum + itemTotal(el), 0) || 0

    return (
        <div className="w-[1130px] mx-16 flex flex-col min-h-screen overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-gradient-to-b from-white to-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
                <div className="py-5 flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Giỏ hàng</h1>
                    <span className="text-sm text-slate-500 hidden sm:inline">
                        Sản phẩm: {currentCart?.length || 0}
                    </span>
                </div>
            </header>

            {/* Bảng giỏ hàng */}
            <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-slate-200 shadow-sm bg-white flex-1">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                        <tr>
                            <th className="py-3.5 px-3 text-left font-semibold">Sản phẩm</th>
                            <th className="py-3.5 px-3 text-center font-semibold">Đơn giá</th>
                            <th className="py-3.5 px-3 text-center font-semibold">Số lượng</th>
                            <th className="py-3.5 px-3 text-right font-semibold">Thành tiền</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(!currentCart || currentCart.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-3 py-16">
                                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                                        <div className="w-16 h-16 rounded-2xl ring-1 ring-slate-200 grid place-items-center">
                                            <span className="text-2xl">🛒</span>
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-900">Giỏ hàng trống</h3>
                                        <p className="text-sm text-slate-500">Hãy thêm sản phẩm để tiếp tục.</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {currentCart?.map((el) => (
                            <tr key={el._id} className="border-t border-slate-100 hover:bg-slate-50/60">
                                {/* Sản phẩm */}
                                <td className="px-3 py-4 align-top">
                                    <div className="flex items-center gap-3" title={el?.title}>
                                        <img
                                            src={el.thumbnail}
                                            alt="Ảnh sản phẩm"
                                            className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200"
                                            loading="lazy"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">{el.title}</p>
                                            {/* Thuộc tính phụ nếu có */}
                                            <p className="text-xs text-slate-500">
                                                {el?.color ? <span>Màu: <span className="text-slate-700 font-semibold">{el.color}</span></span> : <span>&nbsp;</span>}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Đơn giá */}
                                <td className="px-3 py-4 align-top text-center text-slate-700">
                                    {CURRENCY(+el?.price || 0)}
                                </td>

                                {/* Số lượng (chỉ hiển thị đồng bộ UI; nếu bạn muốn chỉnh sửa trực tiếp, có thể gắn input tại đây) */}
                                <td className="px-3 py-4 align-top text-center text-slate-700">
                                    <span className="inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset bg-slate-50 text-slate-700 ring-slate-200">
                                        {el?.quantity}
                                    </span>
                                </td>

                                {/* Thành tiền */}
                                <td className="px-3 py-4 align-top text-right font-semibold text-slate-900">
                                    {CURRENCY(itemTotal(el))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Thanh tổng tiền cố định dưới cùng */}
            <div className="sticky bottom-0 left-0 w-full bg-white border-t border-slate-200">
                <div className="max-w-[1130px] mx-16 py-3 flex items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                        Tổng sản phẩm: <span className="font-semibold text-slate-900">{currentCart?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-base">
                            <span className="text-slate-600 mr-2">Tổng tiền:</span>
                            <span className="text-slate-900 font-bold">{CURRENCY(grandTotal)}</span>
                        </div>
                        <Button handleOnClick={handleSubmit}>Thanh toán</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withBaseComponent(DetailCart)
