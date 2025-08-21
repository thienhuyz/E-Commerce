import React, { memo } from 'react'

const InputSelect = ({ value, changeValue, options }) => {
    return (
        <select
            className='p-3 cursor-pointer shadow-lg text-gray-500 text-base gap-6 relative border border-gray-400 flex justify-between items-center rounded-3xl'
            value={value}
            onChange={e => changeValue(e.target.value)}
        >
            <option value=''>Chọn cách sắp xếp</option>
            {options?.map(el => (
                <option key={el.id} value={el.value}>
                    {el.text}
                </option>
            ))}
        </select>
    )
}

export default memo(InputSelect)
