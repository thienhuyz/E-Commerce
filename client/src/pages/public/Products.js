import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { Breadcrumb, Product, SearchItem, InputSelect, Pagination } from '../../components'
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
        if (response.success) setProducts(response)
    }

    useEffect(() => {
        const queries = Object.fromEntries(params.entries())

        const categoryName =
            categories?.find(c => createslug(c.title) === categorySlug)?.title
        if (categoryName) queries.category = categoryName

        let param = []
        for (let i of params) param.push(i)
        let priceQuery = {}
        for (let i of param) queries[i[0]] = i[1]

        if (queries.to && queries.from) {
            priceQuery = {
                $and: [
                    { price: { gte: queries.from } },
                    { price: { lte: queries.to } }
                ]
            }
            delete queries.price
        } else {
            if (queries.from) queries.price = { gte: queries.from }
            if (queries.to) queries.price = { lte: queries.to }
        }

        delete queries.from
        delete queries.to

        const q = Object.keys(priceQuery).length ? { ...queries, ...priceQuery } : queries
        fetchProductsByCategory(q)
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
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
        if (sort) {
            const base = Object.fromEntries(params.entries())
            const next = { ...base, sort, page: 1 }
            navigate({
                pathname: `/${categorySlug}`,
                search: createSearchParams(next).toString(),
            })

        }
    }, [sort, params, categorySlug, navigate]);


    return (
        <div className='w-full'>

            <Breadcrumb category={displayCategory} />

            <div className='w-main border-2 shadow-md py-6 px-10 flex justify-between mt-4 m-auto rounded-3xl'>
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
                            name='Thương hiệu'
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
                    {products?.products?.map(el => (
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
            {<div className='w-main m-auto my-4 flex justify-end'>
                <Pagination
                    totalCount={products?.counts}
                />
            </div>}

            <div className='w-full h-[500px]'></div>
        </div>
    )
}

export default Products
