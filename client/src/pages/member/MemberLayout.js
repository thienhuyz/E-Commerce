import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../utils/path'
import { useSelector } from 'react-redux'
import MemberSidebar from '../../components/member/MemberSidebar'

const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true} />

    return (
        <div className='flex h-full'>
            <MemberSidebar />
            <div className='flex-auto min-h-screen bg-white shadow-xl'>
                <Outlet />
            </div>
        </div>

    )
}

export default MemberLayout
