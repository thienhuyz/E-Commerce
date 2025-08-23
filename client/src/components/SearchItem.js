import { memo, useState, useEffect } from 'react'
import icons from '../utils/icons'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProducts } from '../apis'
import useDebounce from '../hooks/useDebounce'

import { useSelector } from 'react-redux'
import { createslug } from '../utils/helper'
const { AiOutlineDown } = icons

const SearchItem = ({ name, activeClick, changeActiveFitler, type = 'checkbox' }) => {
    const navigate = useNavigate()
    const { category } = useParams()
    const [selected, setSelected] = useState([])
    const [params] = useSearchParams()

    const { categories } = useSelector(state => state.app)
    const currentCategory = categories?.find(
        c => createslug(c.title) === category
    )
    const brands = currentCategory?.brand || []

    const [price, setPrice] = useState({
        from: '',
        to: ''
    })
    const [bestPrice, setBestPrice] = useState(null)


    const handleSelect = (e) => {
        setSelected([e.target.value])
        changeActiveFitler(null)
    }
    const fetchBestPriceProduct = async () => {
        const repsonse = await apiGetProducts({ sort: '-price', limit: 1 })
        if (repsonse.success) setBestPrice(repsonse.products[0]?.price)
    }

    useEffect(() => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        for (let i of param) queries[i[0]] = i[1]
        if (selected.length > 0) {
            queries.brand = selected[0]
            queries.page = 1
        } else delete queries.brand
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }, [selected])




    useEffect(() => {
        if (type === 'input') fetchBestPriceProduct()
    }, [type])

    const deboucePriceFrom = useDebounce(price?.from, 500)
    const deboucePriceTo = useDebounce(price?.to, 500)

    useEffect(() => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        for (let i of param) queries[i[0]] = i[1]
        if (Number(price.from) > 0) queries.from = price.from
        else delete queries.from
        if (Number(price.to) > 0) queries.to = price.to
        else delete queries.to
        queries.page = 1
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }, [deboucePriceFrom, deboucePriceTo])



    return (
        <div
            className='p-3 cursor-pointer text-gray-500 text-base gap-6 relative border border-gray-400 shadow-lg flex justify-between items-center rounded-3xl'
            onClick={() => changeActiveFitler(name)}
        >
            <span className='capitalize'>{name}</span>
            <AiOutlineDown />
            {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px] rounded-3xl shadow-xl'>
                {type === 'checkbox' && <div className=''>
                    <div className='p-4 items-center flex justify-between gap-8 border-b'>
                        <span className='whitespace-nowrap'>{`${selected.length} Đã chọn`}</span>
                        <span onClick={e => {
                            e.stopPropagation()
                            setSelected([])
                            changeActiveFitler(null)
                        }} className='underline cursor-pointer hover:text-main'>Xoá</span>
                    </div>
                    <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
                        {brands.map((el, index) => (
                            <div key={index} className='flex items-center gap-4'>
                                <input
                                    type="radio"
                                    name="brand"
                                    value={el}
                                    onChange={handleSelect}
                                    id={el}
                                    checked={selected[0] === el}
                                    className='form-radio'
                                />
                                <label className='capitalize text-gray-700' htmlFor={el}>{el}</label>
                            </div>
                        ))}
                    </div>
                </div>}

                {type === 'input' && <div onClick={e => e.stopPropagation()}>
                    <div className='p-4 items-center flex justify-between gap-8 border-b'>
                        <span className='whitespace-nowrap'>{`Sản phẩm cao nhất có giá trị ${Number(bestPrice).toLocaleString()} VND`}</span>
                        <span onClick={e => {
                            e.stopPropagation()
                            setPrice({ from: '', to: '' })
                            changeActiveFitler(null)
                        }} className='underline cursor-pointer hover:text-main'>Xoá</span>
                    </div>
                    <div className='flex items-center p-2 gap-2'>
                        <div className='flex items-center gap-2'>
                            <label htmlFor="from">Từ</label>
                            <input
                                className='form-input rounded-3xl'
                                type="number"
                                id="from"
                                value={price.from}
                                onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))}
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label htmlFor="to">Đến</label>
                            <input
                                className='form-input rounded-3xl'
                                type="number"
                                id="to"
                                value={price.to}
                                onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>}

            </div>}
        </div>
    )
}


export default memo(SearchItem)
