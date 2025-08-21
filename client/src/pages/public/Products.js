import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { Breadcrumb, Product, SearchItem, InputSelect } from '../../components'
import { apiGetProducts } from '../../apis'
import Masonry from 'react-masonry-css'
import { sorts } from '../../utils/contants'

import { useSelector } from 'react-redux'
import { createslug } from '../../utils/helper'

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
};

const Products = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState(null)
    const [activeClick, setActiveClick] = useState(null)
    const [params] = useSearchParams()
    const [sort, setSort] = useState('');

    const { categories } = useSelector(state => state.app)
    const { category: categorySlug } = useParams()
    const fetchProductsByCategory = async (queries) => {
        const response = await apiGetProducts(queries)
        if (response.success) setProducts(response.products)
    }

    useEffect(() => {
        const queries = Object.fromEntries(params.entries())

        const categoryName =
            categories?.find(c => createslug(c.title) === categorySlug)?.title
        if (categoryName) queries.category = categoryName

        let priceQuery = {}
        const from = Number(queries.from)
        const to = Number(queries.to)

        if (from > 0 && to > 0) priceQuery = { price: { gte: from, lte: to } }
        else if (from > 0) priceQuery = { price: { gte: from } }
        else if (to > 0) priceQuery = { price: { lte: to } }

        delete queries.from
        delete queries.to

        const q = Object.keys(priceQuery).length ? { ...queries, ...priceQuery } : queries
        fetchProductsByCategory(q)
    }, [params, categorySlug, categories])


    const changeActiveFitler = useCallback((name) => {
        if (activeClick === name) setActiveClick(null)
        else setActiveClick(name)
    }, [activeClick])

    const slugToTitle = (slug) =>
        slug ? slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'Sản phẩm'

    const displayCategory = useMemo(() => {
        const matched = categories?.find(c => createslug(c.title) === categorySlug)?.title
        if (matched) return matched
        if (categorySlug) return slugToTitle(categorySlug)
        return 'Sản phẩm'
    }, [categories, categorySlug])

    const changeValue = useCallback((value) => {
        setSort(value)
    }, [sort])

    useEffect(() => {
        navigate({
            pathname: `/${categorySlug}`,
            search: createSearchParams({ sort }).toString(),
        });
    }, [sort, categorySlug, navigate]);


    return (
        <div className='w-full'>

            <Breadcrumb category={displayCategory} />

            <div className='w-main border-2 shadow-sm py-6 px-10 flex justify-between mt-4 m-auto rounded-3xl'>
                <div className='w-4/5 flex-auto flex flex-col gap-3'>
                    <span className='font-semibold text-xl'>Lọc sản phẩm</span>
                    <div className='flex items-center gap-4'>
                        <SearchItem
                            name='Giá sản phẩm'
                            type="input"
                            activeClick={activeClick}
                            changeActiveFitler={changeActiveFitler}
                        />
                        <SearchItem
                            name='Màu sản phẩm'
                            activeClick={activeClick}
                            changeActiveFitler={changeActiveFitler}
                        />
                    </div>
                </div>

                <div className='w-1/5 flex flex-col gap-3'>
                    <span className='font-semibold text-xl'>Sắp xếp sản phẩm</span>
                    <div className='w-full'>
                        <InputSelect changeValue={changeValue} value={sort} options={sorts} />
                    </div>
                </div>
            </div>

            <div className='mt-8 w-main m-auto'>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid flex mx-[-10px]"
                    columnClassName="my-masonry-grid_column"
                >
                    {products?.map(el => (
                        <Product
                            key={el._id}
                            pid={el._id}
                            productData={el}
                            normal
                            hideLabel
                        />
                    ))}
                </Masonry>
            </div>

            <div className='w-full h-[500px]'></div>
        </div>
    )
}

export default Products
