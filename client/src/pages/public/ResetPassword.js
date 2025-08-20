import React, { useState } from 'react'
import { Button } from '../../components'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'
import icon from '../../utils/icons'

const { IoEye, IoEyeOff } = icon
const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { token } = useParams()

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            toast.error('Mật khẩu nhập lại không khớp!', { theme: 'colored' })
            return
        }

        const response = await apiResetPassword({ password, token })
        if (response.success) {
            toast.success(response.mes, { theme: 'colored' })
        } else {
            toast.info(response.mes, { theme: 'colored' })
        }
    }

    return (
        <div className='absolute top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
            <div className='flex flex-col gap-4'>

                {/* mật khẩu mới */}
                <label htmlFor="password">Nhập mật khẩu mới:</label>
                <div className="relative w-[800px]">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className='w-full pb-2 border-b outline-none placeholder:text-sm pr-10'
                        placeholder='Exp: 123456'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </span>
                </div>

                {/* xác nhận mật khẩu */}
                <label htmlFor="confirmPassword">Xác nhận lại mật khẩu:</label>
                <div className="relative w-[800px]">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        className='w-full pb-2 border-b outline-none placeholder:text-sm pr-10'
                        placeholder='Nhập lại mật khẩu'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </span>
                </div>

                <div className='flex items-center justify-end w-full gap-4'>
                    <Button
                        handleOnClick={handleResetPassword}
                        style='px-4 py-2 rounded-md text-white bg-blue-500 font-semibold my-2'
                    >
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
