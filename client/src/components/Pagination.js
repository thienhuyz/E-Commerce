import usePagination from '../hooks/usePagination'
import { PagiItem } from './'
import { useSearchParams } from 'react-router-dom'

const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams()
    const pagination = usePagination(totalCount, 2)

    const range = () => {
        const currentPage = +(params.get('page') || 1)
        const pageSize = +process.env.REACT_APP_PRODUCT_LIMIT || 12
        const start = ((currentPage - 1) * pageSize) + 1
        const end = Math.min(currentPage * pageSize, totalCount)

        return `${start} - ${end}`
    }

    return (
        <div className='flex w-main justify-between items-center'>
            {!+params.get('page') &&
                <span className='text-sm italic'>
                    {`Hiển thị sản phẩm từ 1 - ${+process.env.REACT_APP_PRODUCT_LIMIT || 12} trong ${totalCount}`}
                </span>
            }
            {+params.get('page') &&
                <span className='text-sm italic'>
                    {`Hiển thị sản phẩm từ ${range()} trong ${totalCount}`}
                </span>
            }
            <div className='flex items-center'>
                {pagination?.map(el => (
                    <PagiItem key={el}>
                        {el}
                    </PagiItem>
                ))}
            </div>
        </div>
    )
}

export default Pagination
