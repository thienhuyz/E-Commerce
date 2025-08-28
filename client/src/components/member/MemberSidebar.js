import React, { memo, Fragment, useState } from 'react'
import avatar from '../../assets/avatarDefault.png'
import { memberSidebar } from '../../utils/contants'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { AiOutlineCaretDown } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { IoHome } from 'react-icons/io5'

/** Style chung */
const baseItem =
    'px-4 py-2 flex items-center gap-2 rounded-lg transition-colors duration-150'
const itemActive = 'bg-main text-white shadow-sm'
const itemInactive = 'text-slate-700 hover:bg-slate-100'

const MemberSidebar = () => {
    const [actived, setActived] = useState([]) // lưu danh sách id đang mở
    const { current } = useSelector((state) => state.user)

    const toggleTab = (tabID) => {
        setActived((prev) =>
            prev.includes(tabID) ? prev.filter((id) => id !== tabID) : [...prev, tabID]
        )
    }

    const isOpen = (id) => actived.includes(id)

    const fullName =
        `${current?.firstname || ''} ${current?.lastname || ''}`.trim() || 'Thành viên'

    return (
        <aside className="bg-white h-full w-[260px] flex-none border-r border-slate-100 shadow-sm">
            {/* Header user */}
            <div className="flex flex-col items-center justify-center gap-3 py-6 px-4 border-b border-slate-100">
                <img
                    src={current?.avatar || avatar}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div className="text-center">
                    <p className="text-base font-semibold text-slate-800 line-clamp-1">
                        {fullName}
                    </p>
                    {current?.email && (
                        <p className="text-xs text-slate-500 line-clamp-1">{current.email}</p>
                    )}
                </div>
            </div>

            {/* Menu */}
            <nav className="px-3 py-4 space-y-2">
                {memberSidebar.map((el) => (
                    <Fragment key={el.id}>
                        {/* SINGLE */}
                        {el.type === 'SINGLE' && (
                            <NavLink
                                to={el.path}
                                className={({ isActive }) =>
                                    clsx(baseItem, isActive ? itemActive : itemInactive)
                                }
                            >
                                <span className="text-lg">{el.icon}</span>
                                <span className="text-sm font-medium">{el.text}</span>
                            </NavLink>
                        )}

                        {/* PARENT */}
                        {el.type === 'PARENT' && (
                            <div className="rounded-xl border border-slate-100 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => toggleTab(el.id)}
                                    className={clsx(
                                        'w-full flex items-center justify-between px-4 py-2 bg-slate-50 hover:bg-slate-100',
                                        'transition-colors duration-150'
                                    )}
                                    aria-expanded={isOpen(el.id)}
                                    aria-controls={`submenu-${el.id}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{el.icon}</span>
                                        <span className="text-sm font-semibold text-slate-800">
                                            {el.text}
                                        </span>
                                    </div>

                                    <AiOutlineCaretDown
                                        className={clsx(
                                            'transition-transform duration-200 text-slate-600',
                                            isOpen(el.id) ? 'rotate-0' : '-rotate-90'
                                        )}
                                    />
                                </button>

                                {/* Submenu */}
                                {isOpen(el.id) && (
                                    <div id={`submenu-${el.id}`} className="flex flex-col py-2 bg-white">
                                        {el.submenu.map((item) => (
                                            <NavLink
                                                key={item.id ?? item.text}
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        baseItem,
                                                        'mx-2 my-0.5 pl-8 text-sm',
                                                        isActive ? itemActive : itemInactive
                                                    )
                                                }
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span>{item.text}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}

                {/* Link về trang chủ */}
                <div className="pt-6 flex justify-center">
                    <NavLink to="/" className="text-main flex items-center gap-1 text-sm font-medium">
                        <IoHome className="text-base" />
                        <span>Quay về trang chủ</span>
                    </NavLink>
                </div>
            </nav>
        </aside>
    )
}

export default memo(MemberSidebar)
