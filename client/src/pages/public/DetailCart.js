import { SelectQuantity, Button } from '../../components'
import withBaseComponent from '../../hocs/withBaseComponent'
import { useSelector } from 'react-redux'
import { formatMoney } from '../../utils/helper'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
const DetailCart = ({ location }) => {
    const { current } = useSelector(state => state.user)

    // quantities: { [cartItemId]: number }
    const [quantities, setQuantities] = useState({})

    useEffect(() => {
        if (!current?.cart) return
        setQuantities(prev => {
            const next = { ...prev }
            current.cart.forEach(el => {
                if (next[el._id] == null) {
                    const initialQty = Number(el.quantity) > 0 ? Number(el.quantity) : 1
                    next[el._id] = initialQty
                }
            })
            Object.keys(next).forEach(id => {
                if (!current.cart.find(el => el._id === id)) delete next[id]
            })
            return next
        })
    }, [current?.cart])

    const handleQuantity = (id, number) => {
        // Cho phép người dùng xoá để gõ lại, chuẩn hoá khi blur trong component
        if (number === '') {
            setQuantities(prev => ({ ...prev, [id]: '' }))
            return
        }
        const num = Number(number)
        if (Number.isFinite(num) && num >= 1) {
            setQuantities(prev => ({ ...prev, [id]: num }))
        }
    }

    const handleChangeQuantity = (id, flag) => {
        setQuantities(prev => {
            const cur = Number(prev[id] ?? 1) || 1
            if (flag === 'minus' && cur === 1) return prev
            const next = flag === 'plus' ? cur + 1 : cur - 1
            return { ...prev, [id]: next }
        })
    }

    const subtotal = useMemo(() => {
        if (!current?.cart) return 0
        return current.cart.reduce((sum, el) => {
            const qty = Number(quantities[el._id] ?? 1) || 1
            const price = Number(el.product?.price) || 0
            return sum + price * qty
        }, 0)
    }, [current?.cart, quantities])

    return (
        <div className='w-full'>
            <div className='flex flex-col border w-main mx-auto my-8'>
                <div className='w-main mx-auto bg-main text-white font-bold py-3 grid grid-cols-10'>
                    <div className='col-span-6 w-full text-center'>Sản phẩm</div>
                    <div className='col-span-1 w-full text-center'>Số lượng</div>
                    <div className='col-span-3 w-full text-center'>Thành tiền</div>
                </div>

                {current?.cart?.length ? (
                    current.cart.map(el => {
                        const qty = Number(quantities[el._id] ?? 1) || 1
                        const price = Number(el.product?.price) || 0
                        const lineTotal = price * qty
                        return (
                            <div key={el._id} className='w-main mx-auto border-b font-bold py-3 grid grid-cols-10'>
                                {/* Thông tin sản phẩm */}
                                <div className='col-span-6 w-full text-center'>
                                    <div className='flex gap-2 justify-start items-start'>
                                        <img
                                            src={el.product?.thumb}
                                            alt={el.product?.title || 'thumb'}
                                            className='w-28 h-28 object-cover'
                                        />
                                        <div className='flex flex-col items-start gap-1 text-left'>
                                            <span className='text-sm text-main'>{el.product?.title}</span>
                                            {el.color && <span className='text-[10px] font-main'>Màu: {el.color}</span>}
                                            <span className='text-[11px] text-gray-500'>Đơn giá: {formatMoney(price)} VND</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Số lượng */}
                                <div className='col-span-1 w-full text-center'>
                                    <div className='flex items-center justify-center h-full z-10'>
                                        <SelectQuantity
                                            quantity={qty}
                                            handleQuantity={(num) => handleQuantity(el._id, num)}
                                            handleChangeQuantity={(flag) => handleChangeQuantity(el._id, flag)}
                                        />
                                    </div>
                                </div>

                                {/* Thành tiền */}
                                <div className='col-span-3 w-full h-full flex items-center justify-center text-center'>
                                    <span className='text-lg'>{formatMoney(lineTotal)} VND</span>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className='w-main mx-auto py-8 text-center text-sm'>Giỏ hàng trống.</div>
                )}
            </div>

            {/* Tổng kết */}
            <div className='w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3'>
                <span className='flex items-center gap-8 text-base'>
                    <span>Tổng tiền:</span>
                    <span className='text-main font-bold'>{formatMoney(subtotal)} VND</span>
                </span>
                <Button handleOnClick={() => alert("Thanh toán thành công!")}>
                    Thanh toán
                </Button>

            </div>
        </div>
    )
}

export default withBaseComponent(DetailCart)
