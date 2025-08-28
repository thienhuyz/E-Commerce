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
import { useSearchParams } from 'react-router-dom'
import withBaseComponent from '../../hocs/withBaseComponent'

const Personal = ({ navigate }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const {
        register,
        formState: { errors, isDirty },
        handleSubmit,
        reset,
    } = useForm()
    const { current } = useSelector((state) => state.user)

    // Đồng bộ dữ liệu vào form & set locale tiếng Việt cho moment
    useEffect(() => {
        moment.locale('vi')
        reset({
            firstname: current?.firstname || '',
            lastname: current?.lastname || '',
            mobile: current?.mobile || '',
            email: current?.email || '',
            avatar: current?.avatar || '',
            address: current?.address || '',
        })
    }, [current, reset])

    // Cập nhật thông tin
    const handleUpdateInfor = async (data) => {
        const formData = new FormData()
        if (data.avatar?.length > 0) formData.append('avatar', data.avatar[0])
        delete data.avatar
        for (let i of Object.entries(data)) formData.append(i[0], i[1])

        const response = await apiUpdateCurrent(formData)
        if (response?.success) {
            dispatch(getCurrent())
            toast.success(response?.mes || 'Cập nhật thông tin thành công!')
            if (searchParams.get('redirect')) navigate(searchParams.get('redirect'))
        } else {
            toast.error(response?.mes || 'Cập nhật thông tin thất bại, vui lòng thử lại.')
        }
    }

    return (
        <div className="w-[1130px] mx-16 flex flex-col min-h-screen overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-gradient-to-b from-white to-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
                <div className="py-5 flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                        Thông tin cá nhân
                    </h1>
                </div>
            </header>

            {/* Thân form */}
            <main className="mt-4">
                <form
                    onSubmit={handleSubmit(handleUpdateInfor)}
                    className="rounded-2xl ring-1 ring-slate-200 shadow-sm bg-white p-5 sm:p-6"
                >
                    {/* Hàng avatar + mô tả ngắn + info hệ thống */}
                    <section className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
                        <label htmlFor="file" className="cursor-pointer group relative">
                            <img
                                src={current?.avatar || avatar}
                                alt="avatar"
                                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full ring-1 ring-slate-200 group-hover:ring-main transition-all duration-200"
                            />
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs bg-slate-500 text-white px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none">
                                Thay ảnh
                            </span>
                        </label>
                        <input type="file" id="file" {...register('avatar')} hidden />

                        <div className="flex-1 w-full">
                            <div className="text-center sm:text-left">
                                <h2 className="text-lg font-medium text-slate-900">
                                    {current?.firstname || current?.lastname
                                        ? `${current?.lastname || ''} ${current?.firstname || ''}`.trim()
                                        : 'Người dùng'}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Quản lý và cập nhật thông tin tài khoản của bạn.
                                </p>
                            </div>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                                    <span className="text-slate-600 font-medium">Trạng thái:</span>
                                    <span className="text-slate-800">
                                        {current?.isBlocked ? 'Đã khóa' : 'Đang hoạt động'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                                    <span className="text-slate-600 font-medium">Vai trò:</span>
                                    <span className="text-slate-800">
                                        {+current?.role === 1111 ? 'Quản trị viên' : 'Người dùng'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                                    <span className="text-slate-600 font-medium">Tạo lúc:</span>
                                    <span className="text-slate-800">
                                        {current?.createdAt ? moment(current.createdAt).fromNow() : '--'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Lưới form */}
                    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        <InputForm
                            label="Họ"
                            placeholder="Nhập họ"
                            register={register}
                            errors={errors}
                            id="firstname"
                            validate={{ required: 'Vui lòng không để trống' }}
                            fullWidth
                            style="rounded-lg"
                        />
                        <InputForm
                            label="Tên"
                            placeholder="Nhập tên"
                            register={register}
                            errors={errors}
                            id="lastname"
                            validate={{ required: 'Vui lòng không để trống' }}
                            fullWidth
                            style="rounded-lg"
                        />
                        <InputForm
                            label="Email"
                            placeholder="ví dụ: ten@domain.com"
                            register={register}
                            errors={errors}
                            id="email"
                            validate={{
                                required: 'Vui lòng không để trống',
                                pattern: {
                                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    message: 'Email không hợp lệ',
                                },
                            }}
                            type="email"
                            fullWidth
                            style="rounded-lg"
                        />
                        <InputForm
                            label="Số điện thoại"
                            placeholder="ví dụ: 090-123-4567"
                            register={register}
                            errors={errors}
                            id="mobile"
                            validate={{
                                required: 'Vui lòng không để trống',
                                pattern: {
                                    value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            }}
                            fullWidth
                            style="rounded-lg"
                        />
                        <div className="md:col-span-2">
                            <InputForm
                                label="Địa chỉ"
                                placeholder="ví dụ: Bình Dương"
                                register={register}
                                errors={errors}
                                id="address"
                                validate={{ required: 'Vui lòng không để trống' }}
                                fullWidth
                                style="rounded-lg"
                            />
                        </div>
                    </section>

                    {/* Hành động */}
                    <section className="mt-6 flex items-center justify-end">
                        {isDirty ? (
                            <Button2
                                type="submit"
                                className="px-5 py-2 rounded-lg bg-main text-white font-medium hover:opacity-90 disabled:opacity-60"
                            >
                                Cập nhật thông tin
                            </Button2>
                        ) : (
                            <p className="text-sm text-slate-500">Không có thay đổi nào để lưu</p>
                        )}
                    </section>
                </form>
            </main>

            {/* Footer sticky (tùy chọn, để đồng bộ layout) */}
            <div className="sticky bottom-0 left-0 w-full bg-white border-t border-slate-200 py-3" />
        </div>
    )
}

export default withBaseComponent(Personal)
