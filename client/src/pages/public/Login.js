import { useState, useCallback, useEffect } from 'react'
import { InputField, Button, Loading } from '../../components'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from '../../apis/user'
import Swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'
import path from '../../utils/path'
import { login } from '../../store/user/userSlice'
import { showModal } from '../../store/app/appSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from '../../utils/helper'


const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [payload, setPayload] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: '',
    })

    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false)
    const [invalidFields, setInvalidFields] = useState([])
    const [isRegister, setIsRegister] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)

    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            mobile: ''
        })
    }
    const [token, setToken] = useState('')
    const [email, setEmail] = useState('')
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email })
        // console.log(response)
        if (response.success) {
            toast.success(response.mes, { theme: 'colored' })
        } else toast.info(response.mes, { theme: 'colored' })
    }

    useEffect(() => {
        resetPayload()
    }, [isRegister])


    const handleSubmit = useCallback(async () => {
        const { firstname, lastname, mobile, ...data } = payload

        const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)

        if (invalids === 0) {
            if (isRegister) {
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
                const response = await apiRegister(payload)
                dispatch(showModal({ isShowModal: false, modalChildren: null }))

                if (response.success) {
                    setIsVerifiedEmail(true)
                } else Swal.fire('Rất tiếc!', response.mes, 'error')
            } else {
                const rs = await apiLogin(data)
                if (rs.success) {
                    dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }))
                    navigate(`/${path.HOME}`)
                } else Swal.fire('Rất tiếc!', rs.mes, 'error')
            }
        }
    }, [payload, isRegister])

    const finalRegister = async () => {
        const response = await apiFinalRegister(token)

        if (response.success) {
            Swal.fire('Chúc mừng!', response.mes, 'success').then(() => {
                setIsVerifiedEmail(false)
                setIsRegister(false)
                resetPayload()
            })
        } else {
            Swal.fire('Rất tiếc!', response.mes, 'error')
            setIsVerifiedEmail(false)
            setToken('')
        }
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-screen">
            {/* LEFT: Perks */}
            <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-red-50 to-white">
                <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1 rounded-md bg-red-600 text-white font-bold uppercase tracking-wide">
                        TechnoStore
                    </span>
                    <span className="px-4 py-1 rounded-md bg-red-600 text-white font-bold uppercase tracking-wide">
                        Trung Tâm Bảo Hành
                    </span>
                </div>

                <h2 className="text-4xl font-extrabold leading-snug text-gray-800">
                    Nhập hội khách hàng thành viên{" "}
                    <span className="text-red-600">TMEMBER</span>
                </h2>
                <p className="mt-2 text-gray-600">
                    Để không bỏ lỡ các ưu đãi hấp dẫn từ{" "}
                    <span className="font-semibold">TechnoStore</span>
                </p>

                <ul className="mt-8 space-y-4 text-gray-800">
                    <li className="flex gap-3">
                        <span className="text-yellow-500 text-xl">🎁</span>
                        <span>Chiết khấu đến 5% khi mua các sản phẩm tại TechnoStore</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-yellow-500 text-xl">🎁</span>
                        <span>Miễn phí giao hàng cho thành viên TMEMBER, TVIP và đơn từ 300.000đ</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-yellow-500 text-xl">🎁</span>
                        <span>Tặng voucher sinh nhật đến 500.000đ cho khách hàng thành viên</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-yellow-500 text-xl">🎁</span>
                        <span>Trợ giá thu cũ lên đời đến 1 triệu</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-yellow-500 text-xl">🎁</span>
                        <span>Thăng hạng nhận voucher đến 300.000đ</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-yellow-500 text-xl">🎁</span>
                        <span>Đặc quyền T-Student/T-Teacher ưu đãi thêm đến 10%</span>
                    </li>
                </ul>

                <a href="#" className="mt-6 inline-block text-red-600 font-semibold hover:underline">
                    Xem chi tiết chính sách ưu đãi TMEMBER →
                </a>
            </div>

            {/* RIGHT: Login/Register form */}
            <div className="p-12 flex flex-col justify-center bg-white relative">
                {/* overlay verify email */}
                {isVerifiedEmail && (
                    <div className="absolute inset-0 bg-overlay z-50 flex items-center justify-center">
                        <div className="bg-white w-[500px] rounded-md p-8 shadow-lg">
                            <h4>Chúng tôi đã gửi code đến email của bạn. Vui lòng nhập code:</h4>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="p-2 border rounded-md outline-none mt-3"
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-4"
                                onClick={finalRegister}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                )}

                {isForgotPassword && (

                    <div div className="absolute inset-0 z-50 flex items-center justify-center">

                        <div className="absolute inset-0 bg-black/40"></div>


                        <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-center text-red-600">Quên mật khẩu</h2>
                            <p className="mt-2 text-sm text-center text-gray-600">
                                Nhập email để nhận liên kết đặt lại mật khẩu
                            </p>

                            <label htmlFor="email" className="mt-5 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exp: email@gmail.com"
                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
                            />

                            <div className="mt-6 flex gap-3">
                                <Button
                                    handleOnClick={() => setIsForgotPassword(false)}
                                    style="flex-1 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                                >
                                    Quay lại
                                </Button>
                                <Button
                                    handleOnClick={handleForgotPassword}
                                    style="flex-1 h-10 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </div>

                )}

                <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
                    {isRegister ? "Đăng ký TMEMBER" : "Đăng nhập TMEMBER"}
                </h1>

                {isRegister && (
                    <div className="flex gap-2">
                        <InputField
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey="firstname"
                            label="Họ"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                        <InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey="lastname"
                            label="Tên"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </div>
                )}

                <InputField
                    value={payload.email}
                    setValue={setPayload}
                    nameKey="email"
                    label="Email"
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                />

                {isRegister && (
                    <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey="mobile"
                        label="Số điện thoại"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                )}

                <InputField
                    value={payload.password}
                    setValue={setPayload}
                    nameKey="password"
                    type="password"
                    label="Mật khẩu"
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                />

                <div className="text-xs bg-blue-50 border border-blue-200 rounded-md p-3 text-gray-600 my-4">
                    Trải nghiệm đăng nhập liền mạch giữa <b>TechnoStore</b> và Trung Tâm Bảo Hành,
                    ưu tiên dùng tài khoản <b>TechnoStore</b> (nếu có).
                </div>

                <Button handleOnClick={handleSubmit} fw>
                    {isRegister ? "Đăng ký" : "Đăng nhập"}
                </Button>

                <div className="flex justify-between text-sm mt-3">
                    {!isRegister && (
                        <button
                            onClick={() => setIsForgotPassword(true)}
                            className="text-blue-600 hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    )}
                    {!isRegister ? (
                        <button
                            onClick={() => setIsRegister(true)}
                            className="text-blue-600 hover:underline"
                        >
                            Tạo tài khoản mới
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsRegister(false)}
                            className="text-blue-600 hover:underline"
                        >
                            Quay lại đăng nhập
                        </button>
                    )}
                </div>
            </div>
        </div >
    )

}

export default Login
