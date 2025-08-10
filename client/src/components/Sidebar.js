import { NavLink } from 'react-router-dom';
import { createslug } from '../utils/helper';
import { useSelector } from 'react-redux';
import icons from "../utils/icons";

const Sidebar = () => {
    const { categories } = useSelector(state => state.app);
    const {
        MdPhoneIphone, FaLaptop, MdTabletMac, FaHeadphones,
        MdTv, FaPrint, FaCamera, MdDevicesOther
    } = icons;

    const iconMap = {
        "Điện thoại": MdPhoneIphone,
        "Laptop": FaLaptop,
        "Tablet": MdTabletMac,
        "Tai nghe": FaHeadphones,
        "Tivi": MdTv,
        "Máy in": FaPrint,
        "Máy ảnh": FaCamera,
        "Phụ kiện": MdDevicesOther,
    };

    return (
        <div className="flex flex-col border rounded-3xl bg-white shadow-xl py-4">
            {categories?.map((el) => {
                const Icon = iconMap[el.title] || MdDevicesOther; // <-- đặt ngoài JSX
                return (
                    <NavLink
                        key={createslug(el.title)}
                        to={createslug(el.title)}
                        className={({ isActive }) => isActive
                            ? 'bg-main text-white px-5 pt-[10px] pb-[10px] text-xl ml-8 hover:text-main'
                            : 'px-5 pt-[10px] pb-[10px] text-xl ml-8 hover:text-main'
                        }
                    >
                        {/* Nội dung bên trong: thêm icon nhưng GIỮ NGUYÊN CSS NavLink */}
                        <span className="flex items-center gap-3">
                            <Icon size={20} className="shrink-0" />
                            <span>{el.title}</span>
                        </span>
                    </NavLink>
                );
            })}
        </div>
    );
};

export default Sidebar;
