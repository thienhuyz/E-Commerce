import { Button } from '../../components'
import withBaseComponent from '../../hocs/withBaseComponent'
import { useSelector } from 'react-redux'
import { formatMoney } from '../../utils/helper'
import OrderItem from '../../components/OrderItem'
import path from '../../utils/path'
import Swal from 'sweetalert2'
import { createSearchParams } from 'react-router-dom'

const DetailCart = ({ navigate, location }) => {
    const { currentCart, current } = useSelector(state => state.user)
    const handleSubmit = () => {
        if (!current?.address) return Swal.fire({
            icon: 'info',
            title: 'Rất tiếc!',
            text: 'Cập nhật địa chỉ trước khi thanh toán',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Quay lại',
        }).then((result) => {
            if (result.isConfirmed) navigate({
                pathname: `/${path.MEMBER}/${path.PERSONAL}`,
                search: createSearchParams({ redirect: location.pathname }).toString()
            })
        })
        else window.open(`/${path.CHECKOUT}`, '_blank')
    }



    return (
        <div className='w-full'>
            <div className='flex flex-col w-main mx-auto my-8'>
                {/* header */}
                <div className='w-main mx-auto bg-main text-white font-bold py-3 grid grid-cols-10'>
                    <div className='col-span-4 text-center'>Sản phẩm</div>
                    <div className='col-span-3 text-center'>Số lượng</div>
                    <div className='col-span-3 text-center'>Thành tiền</div>
                </div>

                {currentCart?.map(el => (
                    <OrderItem
                        key={el._id}
                        dfQuantity={el.quantity}
                        color={el.color}
                        title={el.title}
                        thumbnail={el.thumbnail}
                        price={el.price}
                        pid={el?.product?._id}
                    />
                ))}

                <div className='w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3 mt-8'>
                    <span className='flex items-center gap-8 text-base'>
                        <span>Tổng tiền:</span>
                        <span className='text-main font-bold'>{`${formatMoney(currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0))} VND`}</span>
                    </span>
                    <Button handleOnClick={handleSubmit}>Thanh toán</Button>

                </div>
            </div>

        </div>
    )
}

export default withBaseComponent(DetailCart)
