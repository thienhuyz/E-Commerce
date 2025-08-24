import { Button2, InputForm } from '../../components'
import moment from 'moment'
import 'moment/locale/vi'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import avatar from '../../assets/avatarDefault.png'
import { apiUpdateCurrent } from '../../apis/user'
import { getCurrent } from '../../store/user/asyncActions'
import { toast } from 'react-toastify'

const Personal = () => {
    const dispatch = useDispatch()
    const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm()
    const { current } = useSelector(state => state.user)

    // Đồng bộ dữ liệu vào form & set locale tiếng Việt cho moment
    useEffect(() => {
        moment.locale('vi')
        reset({
            firstname: current?.firstname,
            lastname: current?.lastname,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar,
        })
    }, [current, reset])

    // Giữ nguyên logic cập nhật thông tin
    const handleUpdateInfor = async (data) => {
        const formData = new FormData()
        if (data.avatar?.length > 0) formData.append('avatar', data.avatar[0])
        delete data.avatar
        for (let i of Object.entries(data)) formData.append(i[0], i[1])

        const response = await apiUpdateCurrent(formData)
        if (response?.success) {
            dispatch(getCurrent())
            toast.success(response?.mes || 'Cập nhật thông tin thành công!')
        } else {
            toast.error(response?.mes || 'Cập nhật thông tin thất bại, vui lòng thử lại.')
        }
    }

    return (
        <div className='w-full px-4 py-6'>
            {/* Tiêu đề cố định và breadcrumb nhỏ */}
            <header className='mb-6'>
                <h1 className='text-3xl font-semibold mt-1 text-center'>Thông tin cá nhân</h1>
            </header>

            {/* Card chính */}
            <div className='mx-auto max-w-4xl'>
                <form
                    onSubmit={handleSubmit(handleUpdateInfor)}
                    className='bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 flex flex-col gap-6'
                >
                    {/* Lưới thông tin */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <InputForm
                            label='Họ'
                            placeholder='Nhập họ'
                            register={register}
                            errors={errors}
                            id='firstname'
                            validate={{ required: 'Vui lòng không để trống' }}
                            fullWidth
                        />
                        <InputForm
                            label='Tên'
                            placeholder='Nhập tên'
                            register={register}
                            errors={errors}
                            id='lastname'
                            validate={{ required: 'Vui lòng không để trống' }}
                            fullWidth
                        />
                        <InputForm
                            label='Email'
                            placeholder='ví dụ: ten@domain.com'
                            register={register}
                            errors={errors}
                            id='email'
                            validate={{
                                required: 'Vui lòng không để trống',
                                pattern: {
                                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    message: 'Email không hợp lệ',
                                },
                            }}
                            type='email'
                            fullWidth
                        />
                        <InputForm
                            label='Số điện thoại'
                            placeholder='ví dụ: 090-123-4567'
                            register={register}
                            errors={errors}
                            id='mobile'
                            validate={{
                                required: 'Vui lòng không để trống',
                                pattern: {
                                    value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            }}
                            fullWidth
                        />
                    </div>

                    {/* Thông tin hệ thống */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4'>
                        <div className='flex items-center gap-2'>
                            <span className='text-slate-600 font-medium'>Trạng thái:</span>
                            <span className='text-slate-800'>{current?.isBlocked ? 'Đã khóa' : 'Đang hoạt động'}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-slate-600 font-medium'>Vai trò:</span>
                            <span className='text-slate-800'>{+current?.role === 1111 ? 'Quản trị viên' : 'Người dùng'}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-slate-600 font-medium'>Tạo lúc:</span>
                            <span className='text-slate-800'>{current?.createdAt ? moment(current.createdAt).fromNow() : '--'}</span>
                        </div>
                    </div>

                    {/* Ảnh đại diện */}
                    <div className='flex items-center gap-5'>
                        <div>
                            <p className='font-medium text-slate-700'>Ảnh đại diện</p>
                            <p className='text-sm text-slate-500'>Nhấn vào ảnh để chọn tệp mới</p>
                        </div>
                        <label htmlFor='file' className='cursor-pointer group'>
                            <img
                                src={current?.avatar || avatar}
                                alt='avatar'
                                className='w-20 h-20 object-cover rounded-full ring-2 ring-transparent group-hover:ring-main transition-all'
                            />
                        </label>
                        <input type='file' id='file' {...register('avatar')} hidden />
                    </div>

                    {/* Nút hành động (giữ nguyên logic: chỉ hiện khi isDirty = true) */}
                    {isDirty && (
                        <div className='w-full pt-2 flex justify-end'>
                            <Button2 type='submit' className='px-5 py-2 rounded-lg bg-main text-white font-medium hover:opacity-90'>
                                Cập nhật thông tin
                            </Button2>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Personal
