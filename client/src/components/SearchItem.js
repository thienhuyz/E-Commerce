import { memo, useState, useEffect } from 'react'
import icons from '../utils/icons'
import { colors } from '../utils/contants'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import { apiGetProducts } from '../apis'
import useDebounce from '../hooks/useDebounce'
const { AiOutlineDown } = icons

const SearchItem = ({ name, activeClick, changeActiveFitler, type = 'checkbox' }) => {
    const navigate = useNavigate()
    const { category } = useParams()
    const [selected, setSelected] = useState([])

    const [price, setPrice] = useState({
        from: '',
        to: ''
    })
    const [bestPrice, setBestPrice] = useState(null)


    const handleSelect = (e) => {
        const alreadyEl = selected.find(el => el === e.target.value)
        if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
        else setSelected(prev => [...prev, e.target.value])
        changeActiveFitler(null)
    }
    const fetchBestPriceProduct = async () => {
        const repsonse = await apiGetProducts({ sort: '-price', limit: 1 })
        if (repsonse.success) setBestPrice(repsonse.products[0]?.price)
    }

    useEffect(() => {
        const params = selected.length
            ? createSearchParams({ color: selected.join(',') }).toString()
            : '';

        navigate({ pathname: `/${category}`, search: params }, { replace: true });
    }, [selected, category, navigate]);

    useEffect(() => {
        if (type === 'input') fetchBestPriceProduct()
    }, [type])

    const deboucePriceFrom = useDebounce(price?.from, 500)
    const deboucePriceTo = useDebounce(price?.to, 500)

    useEffect(() => {
        const data = {}
        if (Number(price.from) > 0) data.from = price.from
        if (Number(price.to) > 0) data.to = price.to

        navigate({
            pathname: `/${category}`,
            search: createSearchParams(data).toString()
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
                        }} className='underline cursor-pointer hover:text-main'>Xoá</span>
                    </div>
                    <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
                        {colors.map((el, index) => (
                            <div key={index} className='flex items-center gap-4'>
                                <input
                                    type="checkbox"
                                    value={el}
                                    onChange={handleSelect}
                                    id={el}
                                    checked={selected.some(selectedItem => selectedItem === el)}
                                    className='form-checkbox'
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
