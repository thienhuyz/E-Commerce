import { useState } from 'react'
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
        if (response.success) toast.success(response.mes, { theme: 'colored' })
        else toast.info(response.mes, { theme: 'colored' })
    }

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10">
                <h1 className="text-3xl font-bold text-center text-red-600">Đặt lại mật khẩu</h1>
                <p className="mt-2 text-base text-center text-gray-600">
                    Nhập mật khẩu mới cho tài khoản của bạn
                </p>

                {/* Mật khẩu mới */}
                <label htmlFor="password" className="mt-6 block text-sm font-medium text-gray-700">
                    Mật khẩu mới
                </label>
                <div className="relative mt-2">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 pr-10"
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                        {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </button>
                </div>

                {/* Xác nhận mật khẩu */}
                <label htmlFor="confirmPassword" className="mt-4 block text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu
                </label>
                <div className="relative mt-2">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 pr-10"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                        {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </button>
                </div>

                {/* Gợi ý khớp mật khẩu (chỉ hiển thị khi đã gõ) */}
                {confirmPassword.length > 0 && (
                    <p
                        className={`mt-2 text-sm ${password === confirmPassword ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {password === confirmPassword ? '✔ Mật khẩu khớp' : '✖ Mật khẩu không khớp'}
                    </p>
                )}

                <div className="mt-6">
                    <Button
                        handleOnClick={handleResetPassword}
                        style="w-full h-11 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    >
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
