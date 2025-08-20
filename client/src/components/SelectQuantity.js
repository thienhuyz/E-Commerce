import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
    const minusDisabled = Number(quantity) <= 1

    return (
        <div className="flex items-center gap-2 mb-6">
            {/* Nhãn số lượng */}
            <span className=" font-medium text-lg">Số lượng</span>

            {/* Nhóm control số lượng */}
            <div className="inline-flex items-stretch rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden w-max">
                <button
                    type="button"
                    aria-label="Giảm số lượng"
                    onClick={() => handleChangeQuantity('minus')}
                    disabled={minusDisabled}
                    className={`h-9 w-9 grid place-items-center select-none
                      transition
                      ${minusDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'}
                      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300`}
                >
                    –
                </button>

                <input
                    className="h-9 w-[50px] text-center font-medium text-gray-900 outline-none
                     focus:ring-0 border-x border-gray-200"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={quantity}
                    onChange={(e) => handleQuantity(e.target.value)}
                    aria-label="Số lượng"
                />

                <button
                    type="button"
                    aria-label="Tăng số lượng"
                    onClick={() => handleChangeQuantity('plus')}
                    className="h-9 w-9 grid place-items-center select-none
                     text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition
                     focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300"
                >
                    +
                </button>
            </div>
        </div>
    )
}

export default memo(SelectQuantity)
