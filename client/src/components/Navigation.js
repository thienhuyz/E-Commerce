import { navigation } from '../utils/contants';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div className=' h-[48px] py-2 text-lg flex items-center text-white font-semibold'>
            {navigation.map(el => (
                <NavLink
                    to={el.path}
                    key={el.id}
                    className={({ isActive }) =>
                        isActive
                            ? 'px-10 hover:text-black text-black'
                            : 'px-10 hover:text-black'
                    }
                >
                    {el.value}
                </NavLink>
            ))}
        </div>
    );
};

export default Navigation;

