import logo from '../assets/logo.png';
import icons from '../utils/icons';
import { Link } from 'react-router-dom';
import path from '../utils/path';
import Navigation from './Navigation';

const Header = () => {
    const { BsHandbagFill, FaUserCircle } = icons
    return (
        <div className="w-full bg-main flex justify-center mb-4">
            <div className="w-main flex justify-between h-[72px] py-[35px] items-center">
                <Link to={`/${path.HOME}`}>
                    <img src={logo} alt="Logo" className="w-[220px] object-contain" />
                </Link>
                <Navigation />
                <div className='flex text-[13px]'>
                    <div className="flex items-center justify-center gap-2 px-6 font-semibold ">
                        <BsHandbagFill color="white" />
                        <span className='text-white text-base'>0 Giỏ hàng</span>
                    </div>

                    <div className="flex items-center justify-center px-6">
                        <FaUserCircle color="white" size={24} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Header
