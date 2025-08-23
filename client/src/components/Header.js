import logo from '../assets/logo.png';
import icons from '../utils/icons';
import { Link, useNavigate } from 'react-router-dom';
import path from '../utils/path';
import Navigation from './Navigation';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, Fragment } from 'react'
import { getCurrent } from '../store/user/asyncActions'
import { logout, clearMessage } from '../store/user/userSlice'
import Swal from 'sweetalert2'

const Header = () => {
    const { BsHandbagFill, FaUserCircle, AiOutlineLogout, AiOutlineSearch } = icons
    const dispatch = useDispatch()
    const { isLoggedIn, current, mes } = useSelector(state => state.user)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedIn) dispatch(getCurrent())
    }, [dispatch, isLoggedIn])

    useEffect(() => {
        if (mes) Swal.fire('Rất tiếc!', mes, 'info').then(() => {
            dispatch(clearMessage())
            navigate(`/${path.LOGIN}`)
        })
    }, [mes])

    return (
        <div className="w-full bg-main flex justify-center mb-4">
            <div className="w-main flex justify-between h-[72px] py-[35px] items-center">
                <Link to={`/${path.HOME}`}>
                    <img src={logo} alt="Logo" className="w-[220px] object-contain mb-2" />
                </Link>
                <Navigation />
                <div className="relative max-w-[420px] w-full">
                    <AiOutlineSearch
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        color="#111"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Bạn muốn mua gì hôm nay?"
                        className="w-full h-10 pl-10 pr-4 rounded-full bg-white placeholder:text-gray-400 outline-none"
                    />
                </div>
                <div className='flex text-[13px]'>
                    <div className="cursor-pointer flex items-center justify-center gap-2 px-8 font-semibold ">
                        <BsHandbagFill size="16" color="white" />
                        <span className='text-white text-lg'>0 Giỏ hàng</span>
                    </div>

                    <div
                        className="cursor-pointer flex items-center justify-center gap-2 px-6 py-2 text-base font-semibold text-white 
             rounded-md bg-red-500 hover:bg-red-700 transition-colors"
                    >
                        {isLoggedIn && current
                            ? <div className='flex gap-4 text-base items-center '>
                                <Link

                                    to={+current?.role === 1111 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}
                                >

                                    <span>{`${current?.firstname} ${current?.lastname} `}</span>
                                </Link>

                                <span
                                    className='cursor-pointer'
                                    onClick={() => dispatch(logout())}>
                                    <AiOutlineLogout color="white" size={24} />
                                </span>
                            </div>
                            : <Link className='cursor-pointer flex gap-4 text-lg items-center' to={`/${path.LOGIN}`}>Đăng nhập <FaUserCircle color="white" size={24} /></Link>}


                    </div>


                </div>

            </div>
        </div>
    )
}

export default Header
