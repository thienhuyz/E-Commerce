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
import { BsCartCheckFill } from "react-icons/bs";
import withBaseComponent from '../hocs/withBaseComponent';
import { showCart } from '../store/app/appSlice';

const Header = () => {
    const { FaUserCircle, AiOutlineLogout, AiOutlineSearch } = icons
    const dispatch = useDispatch()
    const { isLoggedIn, current, mes } = useSelector(state => state.user)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()
    const [isShowOption, setIsShowOption] = useState(false);

    useEffect(() => {
        if (isLoggedIn) dispatch(getCurrent())
    }, [dispatch, isLoggedIn])

    useEffect(() => {
        if (mes) Swal.fire('Rất tiếc!', mes, 'info').then(() => {
            dispatch(clearMessage())
            navigate(`/${path.LOGIN}`)
        })
    }, [mes])

    useEffect(() => {
        const handleClickoutOptions = (e) => {
            const profile = document.getElementById('profile')
            if (profile && !profile.contains(e.target)) setIsShowOption(false)
        }

        document.addEventListener('click', handleClickoutOptions)
        return () => document.removeEventListener('click', handleClickoutOptions)
    }, [])



    return (
        <div className="w-full bg-main flex justify-center mb-4">
            <div className="w-main flex justify-between h-[72px] py-[35px] items-center">
                <Link to={`/${path.HOME}`}>
                    <img src={logo} alt="Logo" className="w-[220px] object-contain mb-2" />
                </Link>
                <Navigation />
                <div className="relative max-w-[360px] w-full">
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
                        className="w-[360px] h-10 pl-10 pr-4 rounded-full bg-white placeholder:text-gray-400 outline-none"
                    />
                </div>
                <div className='flex text-[13px]'>
                    {isLoggedIn && current ? <div onClick={() => dispatch(showCart())}
                        className="cursor-pointer w-[220px] flex items-center justify-center gap-2 px-8 font-semibold ">
                        <BsCartCheckFill size="28" color="white" />
                        <span className='text-lg text-white'>{`${current?.cart?.length || 0} sản phẩm`}</span>
                    </div> : <div className='w-[220px]'></div>}


                    <div
                        className="cursor-pointer flex items-center justify-center gap-2 py-2  text-base font-semibold text-white 
             rounded-md bg-red-500 hover:bg-red-700 transition-colors"
                    >
                        {isLoggedIn && current
                            ? <div
                                className='flex gap-4 text-base items-center cursor-pointer  justify-center px-6 relative '
                                onClick={() => setIsShowOption(prev => !prev)}
                                id='profile'
                            >
                                <span className='flex text-lg'>{`${current?.firstname} ${current?.lastname}`} <FaUserCircle className='ml-4' color="white" size={30} /></span>

                                {isShowOption &&
                                    (
                                        <div onClick={e => e.stopPropagation()} className="absolute flex-col flex m-auto top-[30px] left-[140px] bg-red-500 border min-w-[140px] py-2 z-50 rounded-xl">
                                            <Link
                                                className="p-2 w-full hover:bg-red-700"
                                                to={`${path.MEMBER}/${path.PERSONAL}`}
                                            >
                                                Trang cá nhân
                                            </Link>

                                            {+current.role === 1111 && (
                                                <Link
                                                    className="p-2 w-full hover:bg-red-700"
                                                    to={`${path.ADMIN}/${path.DASHBOARD}`}
                                                >
                                                    Trang quản lý
                                                </Link>
                                            )}

                                            <span
                                                onClick={() => dispatch(logout())}
                                                className="p-2 w-full hover:bg-red-700 flex"
                                            >
                                                Đăng xuất <AiOutlineLogout className='ml-2' color="white" size={20} />
                                            </span>
                                        </div>
                                    )}
                            </div>
                            : <Link className='cursor-pointer flex mx-4 text-lg items-center' to={`/${path.LOGIN}`}>Đăng nhập <FaUserCircle className='ml-4' color="white" size={30} /></Link>}


                    </div>


                </div>

            </div>
        </div>
    )
}

export default withBaseComponent(Header)
