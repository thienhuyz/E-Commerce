import { useState, useCallback, useEffect } from 'react'
import { InputField, Button } from '../../components'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from '../../apis/user'
import Swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'
import path from '../../utils/path'
import { login } from '../../store/user/userSlice'
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
                const response = await apiRegister(payload)
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
        <div className='w-screen h-screen relative bg-main'>
            {isVerifiedEmail && (
                <div className='w-screen h-screen relative'>
                    <div className='absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col justify-center items-center'>
                        <div className='bg-white w-[500px] rounded-md p-8'>
                            <h4 className=''>Chúng tôi đã gửi code đến email của bạn. Vui lòng kiểm tra email và nhập code:</h4>
                            <input
                                type="text"
                                value={token}
                                onChange={e => setToken(e.target.value)}
                                className='p-2 border rounded-md outline-none'
                            />
                            <button
                                type='button'
                                className='px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-4'
                                onClick={finalRegister}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>

            )}

            {isForgotPassword && <div className='absolute top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
                <div className='flex flex-col gap-4'>
                    <label htmlFor="email">Nhập email của bạn:</label>
                    <input
                        type="text"
                        id="email"
                        className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                        placeholder='Exp: email@gmail.com'
                        value={email}
                        onChange={e => setEmail(e.target.value)}


                    />
                    <div className='flex items-center justify-between w-full'>
                        <Button handleOnClick={() => setIsForgotPassword(false)}> Quay lại</Button>
                        <Button
                            handleOnClick={handleForgotPassword}
                            style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'>
                            Xác nhận
                        </Button>
                    </div>
                </div>

            </div>}


            <div className='absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex'>
                <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]'>
                    <h1 className='text-[28px] font-semibold text-main mb-8'>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h1>
                    {isRegister && <div className='flex items-center gap-2'>
                        <InputField
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey='firstname'
                            label='Họ'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                        <InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey='lastname'
                            label='Tên'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </div>}

                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        label='Email'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    {isRegister && <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey='mobile'
                        label='Số điện thoại'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />}
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        label='Mật khẩu'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    <Button
                        handleOnClick={handleSubmit}
                        fw>
                        {isRegister ? 'Đăng ký' : 'Đăng nhập'}
                    </Button>
                    <div className='flex items-center justify-between my-2 w-full text-sm'>
                        {!isRegister && <span onClick={() => setIsForgotPassword(true)} className='text-blue-500 hover:underline cursor-pointer'>
                            Quên mật khẩu?
                        </span>}
                        {!isRegister && <span
                            className='text-blue-500 hover:underline cursor-pointer'
                            onClick={() => setIsRegister(true)}>
                            Tạo tài khoản mới
                        </span>}
                        {isRegister && <span
                            className='text-blue-500 hover:underline cursor-pointer w-full text-center'
                            onClick={() => setIsRegister(false)}>
                            Quay lại đăng nhập
                        </span>}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login
