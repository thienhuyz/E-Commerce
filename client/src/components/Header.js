import logo from '../assets/logo.png';
import icons from '../utils/icons';
import { Link } from 'react-router-dom';
import path from '../utils/path';
import Navigation from './Navigation';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { getCurrent } from '../store/user/asyncActions'
import { logout } from '../store/user/userSlice'

const Header = () => {
    const { BsHandbagFill, FaUserCircle, AiOutlineLogout } = icons
    const dispatch = useDispatch()
    const { isLoggedIn, current } = useSelector(state => state.user)

    useEffect(() => {
        if (isLoggedIn) dispatch(getCurrent())
    }, [dispatch, isLoggedIn])
    return (
        <div className="w-full bg-main flex justify-center mb-4">
            <div className="w-main flex justify-between h-[72px] py-[35px] items-center">
                <Link to={`/${path.HOME}`}>
                    <img src={logo} alt="Logo" className="w-[220px] object-contain" />
                </Link>
                <Navigation />
                <div className='flex text-[13px]'>
                    <div className="cursor-pointer flex items-center justify-center gap-2 px-6 font-semibold ">
                        <BsHandbagFill color="white" />
                        <span className='text-white text-base'>0 Giỏ hàng</span>
                    </div>

                    <div
                        className="cursor-pointer flex items-center justify-center gap-2 px-6 py-2 text-base font-semibold text-white 
             rounded-md bg-red-500 hover:bg-red-700 transition-colors"
                    >
                        {isLoggedIn
                            ? <div className='flex gap-4 text-base items-center '>
                                <span>{`${current?.firstname} ${current?.lastname} `}</span>
                                <span
                                    className='cursor-pointer'
                                    onClick={() => dispatch(logout())}>
                                    <AiOutlineLogout color="white" size={24} />
                                </span>
                            </div>
                            : <Link className='cursor-pointer flex gap-4 text-base items-center' to={`/${path.LOGIN}`}>Đăng nhập <FaUserCircle color="white" size={24} /></Link>}


                    </div>

                </div>

            </div>
        </div>
    )
}

export default Header
