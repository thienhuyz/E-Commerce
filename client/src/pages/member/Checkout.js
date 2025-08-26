import React from 'react'
import { useSelector } from 'react-redux'

const Checkout = () => {
    const { current } = useSelector(state => state.user)
    console.log(current.cart)

    return (
        <div className='p-8 grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6'>
            {/* Bỏ ảnh, vẫn giữ col-span để căn giữa như cũ */}
            <div className='col-span-4 flex justify-center items-center'>
                {/* chỗ này để trống */}
            </div>

            <div className='flex flex-col items-center col-span-6 gap-6'>
                <h2 className='text-2xl font-bold'>Checkout your order</h2>
                <div>
                    content products
                </div>
                <div>
                    input address
                </div>
                <div>
                    payment
                </div>
            </div>
        </div>
    )
}

export default Checkout
