import React from 'react'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { Link } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import { createslug } from '../utils/helper'   // <-- thêm

const Breadcrumb = ({ title, category }) => {
    const routes = [
        { path: '/', breadcrumb: 'Trang chủ' },
        { path: '/:category', breadcrumb: category },
        { path: '/:category/:pid/:title', breadcrumb: title },
    ]
    const breadcrumbs = useBreadcrumbs(routes)

    return (
        <div className='text-base pb-4 flex items-center gap-1'>
            {breadcrumbs
                .filter(el => !el.match.route === false)
                .map(({ match, breadcrumb }, index, self) => {
                    // nếu là cấp /:category -> ép path về slug
                    const to = match.route.path === '/:category'
                        ? `/${createslug(match.params.category || String(breadcrumb))}`
                        : match.pathname
                    return (
                        <Link key={match.pathname} to={to} className='flex gap-1 items-center hover:text-main'>
                            <span className='capitalize'>{breadcrumb}</span>
                            {index !== self.length - 1 && <IoIosArrowForward />}
                        </Link>
                    )
                })}
        </div>
    )
}

export default Breadcrumb
