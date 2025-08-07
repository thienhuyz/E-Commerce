import { navigation } from '../utils/contants';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div className=' h-[48px] py-2 text-base flex items-center text-white font-semibold'>
            {navigation.map(el => (
                <NavLink
                    to={el.path}
                    key={el.id}
                    className={({ isActive }) =>
                        isActive
                            ? 'pr-12 hover:text-black text-black'
                            : 'pr-12 hover:text-black'
                    }
                >
                    {el.value}
                </NavLink>
            ))}
        </div>
    );
};

export default Navigation;

