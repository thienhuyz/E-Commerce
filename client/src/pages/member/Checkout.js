import { useSelector } from 'react-redux'
// (Bỏ ảnh để cân bố cục) // import payment from '../../assets/payment.svg'
import { formatMoney } from '../../utils/helper'
import Paypal from './Paypal'
import { Congrat } from '../../components'
import { useEffect, useState } from 'react'
import withBaseComponent from '../../hocs/withBaseComponent'
import { getCurrent } from '../../store/user/asyncActions'

const Checkout = ({ dispatch }) => {
    const { currentCart, current } = useSelector(state => state.user)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        dispatch(getCurrent())
    }, [dispatch])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 sm:p-10">
            {isSuccess && <Congrat />}

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Tiêu đề */}
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
                    Thanh toán sản phẩm
                </h1>

                {/* Lưới 2 cột cân đối */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Bảng sản phẩm */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Giỏ hàng</h2>
                            <span className="text-sm text-gray-500">
                                {currentCart?.length || 0} sản phẩm
                            </span>
                        </div>

                        <div className="border-t border-gray-100">
                            <table className="w-full">
                                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3 text-left">Sản phẩm</th>
                                        <th className="px-5 py-3 text-center">Số lượng</th>
                                        <th className="px-5 py-3 text-right">Giá</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {currentCart?.length ? (
                                        currentCart?.map(el => (
                                            <tr key={el._id} className="text-sm hover:bg-gray-50/60">
                                                <td className="px-5 py-3">
                                                    <div className="line-clamp-2">{el.title}</div>
                                                </td>
                                                <td className="px-5 py-3 text-center">{el.quantity}</td>
                                                <td className="px-5 py-3 text-right font-medium">
                                                    {formatMoney(el.price) + ' VND'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="px-5 py-10 text-center text-gray-500" colSpan={3}>
                                                Giỏ hàng của bạn đang trống.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tóm tắt & PayPal */}
                    <div className="flex flex-col gap-6">
                        {/* Tóm tắt đơn hàng */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-5">
                            <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-base">
                                    <span className="text-gray-600 mr-2">Tổng tiền:</span>
                                    <span className="text-main font-bold">
                                        {`${formatMoney(
                                            currentCart?.reduce(
                                                (sum, el) => +el?.price * el?.quantity + sum,
                                                0
                                            )
                                        )} VND`}
                                    </span>
                                </div>

                                <div className="flex items-start gap-2 text-sm">
                                    <span className="font-medium text-gray-600">Địa chỉ:</span>
                                    <span className="text-main font-semibold">
                                        {current?.address || 'Chưa cập nhật'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thanh toán PayPal (giữ nguyên logic inline) */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-5">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                                Thanh toán với PayPal
                            </h3>

                            <Paypal
                                payload={{
                                    products: currentCart,
                                    total: Math.round(
                                        +currentCart?.reduce(
                                            (sum, el) => +el?.price * el.quantity + sum,
                                            0
                                        ) / 23500
                                    ),
                                    address: current?.address
                                }}
                                setIsSuccess={setIsSuccess}
                                amount={Math.round(
                                    +currentCart?.reduce(
                                        (sum, el) => +el?.price * el.quantity + sum,
                                        0
                                    ) / 23500
                                )}
                            />

                            <p className="mt-3 text-xs text-gray-500">
                                Số tiền quy đổi sang USD được làm tròn khi hiển thị trên PayPal.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Ghi chú hỗ trợ (tuỳ chọn) */}
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 p-4 text-sm text-gray-600">
                    Cần hỗ trợ? Liên hệ{' '}
                    <a href="mailto:support@example.com" className="underline underline-offset-2">
                        support@example.com
                    </a>
                    .
                </div>
            </div>
        </div>
    )
}

export default withBaseComponent(Checkout)
