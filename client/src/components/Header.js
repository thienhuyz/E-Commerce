import logo from '../assets/logo.png';
import icons from '../utils/icons';
import { Link } from 'react-router-dom';
import path from '../utils/path';

const Header = () => {
    const { RiPhoneFill, MdEmail, BsHandbagFill, FaUserCircle } = icons
    return (
        <div className="w-full bg-main flex justify-center ">
            <div className="border w-main flex justify-between h-[110px] py-[35px] ">
                <Link to={`/${path.HOME}`}>
                    <img src={logo} alt="Logo" className="w-[220px] object-contain mt-2" />
                </Link>
                <div className='flex text-[13px]'>
                    <div className="flex flex-col px-6 border-r items-center">
                        <span className="flex gap-4 items-center">
                            <RiPhoneFill color="white" />
                            <span className="font-semibold text-white">(+84) 8888 8888</span>
                        </span>
                        <span className='text-white'>Mon-Sat 7:00AM - 21:00PM</span>
                    </div>

                    <div className="flex flex-col items-center px-6 border-r">
                        <span className="flex gap-4 items-center">
                            <MdEmail color="white" />
                            <span className="font-semibold text-white">SUPPORT@GMAIL.COM</span>
                        </span>
                        <span className='text-white'>Online Support 24/7</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 px-6 border-r">
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
