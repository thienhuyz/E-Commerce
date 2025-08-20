import React, { useState } from 'react'
import { IoEye, IoEyeOff } from 'react-icons/io5'

const InputField = ({ value, setValue, label, nameKey, type, invalidFields, setInvalidFields }) => {
    const [show, setShow] = useState(false)
    const isPassword = type === 'password'
    const actualType = isPassword ? (show ? 'text' : 'password') : (type || 'text')

    return (
        <div className='w-full flex flex-col relative'>
            {value.trim() !== '' && (
                <label
                    className='text-base animate-slide-top-sm absolute top-[-12px] left-[12px] block bg-white px-1'
                    htmlFor={label}
                >
                    {label}
                </label>
            )}


            <input
                autoComplete="off"
                type={actualType}
                className={`px-4 py-4 rounded-sm border w-full mb-8 placeholder:text-base placeholder:italic outline-none ${isPassword ? 'pr-12' : ''}`}
                placeholder={label}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidFields([])}
            />

            {invalidFields?.some(el => el.name === nameKey) && (
                <small className='absolute right-3 top-[-10px] -translate-y-1/2 text-main text-sm italic'>
                    {invalidFields.find(el => el.name === nameKey)?.mes}
                </small>
            )}

            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShow(prev => !prev)}
                    className="absolute right-4 top-8 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                    {show ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
            )}

        </div>
    )
}

export default InputField
