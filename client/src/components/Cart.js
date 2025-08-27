import { AiFillCloseCircle } from 'react-icons/ai'
import withBaseComponent from '../hocs/withBaseComponent'
import { showCart } from '../store/app/appSlice'
import { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { formatMoney } from '../utils/helper'
import { Button } from '../components'
import { ImBin } from 'react-icons/im'
import { getCurrent } from '../store/user/asyncActions'
import { toast } from 'react-toastify'
import { apiRemoveCart, apiUpdateCart } from '../apis'
import path from '../utils/path'

const splitColors = (v) =>
    (Array.isArray(v) ? v : String(v || '').split(','))
        .map(s => s.trim())
        .filter(Boolean)

const Cart = ({ dispatch, navigate }) => {
    const { currentCart } = useSelector(state => state.user)

    const removeCart = async (pid, color) => {
        const rs = await apiRemoveCart(pid, color)
        if (rs?.success) dispatch(getCurrent())
        else toast.error(rs?.mes || 'Remove failed')
    }

    const changeColor = async (pid, newColor) => {
        const rs = await apiUpdateCart({ pid, color: newColor })
        if (rs?.success) { toast.success(rs.mes); dispatch(getCurrent()) }
        else toast.error(rs?.mes || 'Update color failed')
    }


    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className='fixed top-0 right-0 z-[9999] h-screen w-full sm:w-[400px] bg-black text-white grid grid-rows-10 shadow-2xl'
        >
            {/* Header */}
            <header className='row-span-1 flex items-center justify-between px-6 py-4 border-b border-gray-700 font-semibold text-xl'>
                <span>Giỏ hàng của bạn</span>
                <button onClick={() => dispatch(showCart())} className='p-2 rounded-full hover:bg-gray-800' aria-label='Close cart'>
                    <AiFillCloseCircle size={24} />
                </button>
            </header>

            {/* Items: nội dung cuộn riêng, panel vẫn dính nhờ wrapper fixed */}
            <section className='row-span-7 overflow-y-auto px-6 py-3 space-y-3'>
                {!currentCart.length && (
                    <span className='text-lg italic text-gray-400 justify-center'>Giỏ hàng trống</span>
                )}

                {currentCart.map((el) => {
                    const product = el.product || {}
                    const colorsSource = el?.color ?? product?.color ?? ''
                    const colorOptions = splitColors(colorsSource)
                    const selectedColor = colorsSource.includes(',') ? colorOptions[0] : colorsSource

                    return (
                        <div key={el._id} className='flex items-center justify-between gap-3 border-b border-gray-800 pb-3'>
                            <div className='flex items-center gap-3'>
                                <img src={el.thumbnail} alt={el.title || 'thumb'} className='w-20 h-20 object-cover rounded-md' />
                                <div className='flex flex-col gap-1'>
                                    <span className='text-sm font-medium line-clamp-1'>{el.title}</span>
                                    <span className='text-[11px] text-gray-400'>{`Số lượng: ${el.quantity}`}</span>
                                    {colorOptions.length > 0 && (
                                        <div className='flex items-center gap-2'>

                                            <span className='text-[11px] text-gray-400'>Màu:</span>
                                            <select
                                                className='bg-gray-900 border border-gray-700 text-xs rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600'
                                                value={selectedColor}
                                                onChange={(e) => changeColor(el._id, e.target.value)}
                                            >
                                                {colorOptions.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <span className='text-sm'>{formatMoney(el.price) + ' VND'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => removeCart(el.product?._id, el.color)}
                                className='h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-800'
                                aria-label='Remove item'
                                title='Remove'
                            >
                                <ImBin size={16} />
                            </button>
                        </div>
                    )
                })}
            </section>

            {/* Footer */}
            <div className='row-span-2 flex flex-col justify-between px-6 py-4 border-t border-gray-800'>
                <div className='flex items-center justify-between'>
                    <span className='text-gray-300'>Tổng tiền:</span>
                    <span className='font-semibold'>{formatMoney(currentCart.reduce((sum, el) => sum + Number(el.price) * el.quantity, 0)) + ' VND'}</span>
                </div>
                <Button
                    handleOnClick={() => {
                        dispatch(showCart())
                        navigate(`/${path.MEMBER}/${path.DETAIL_CART}`)
                    }}
                    className='rounded-none w-full bg-main py-3'
                >
                    Chi tiết giỏ hàng
                </Button>
            </div>
        </div>
    )
}

export default withBaseComponent(memo(Cart))
