import { formatMoney, renderStarFromNumber } from '../utils/helper';
import label from '../assets/label.png';
import { SelectOption } from './'
import icon from '../utils/icons'
import { useState } from 'react';
import path from '../utils/path'
import withBaseComponent from '../hocs/withBaseComponent'
import Swal from 'sweetalert2'
import { apiUpdateCart } from '../apis';
import { toast } from 'react-toastify'
import { getCurrent } from '../store/user/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import { BsCartCheckFill, BsFillCartPlusFill } from "react-icons/bs";

const { BsFillSuitHeartFill } = icon

const Product = ({ productData, isNew, hideLabel, navigate }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    const { current } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const handleClickOptions = async (e, flag) => {
        e.stopPropagation()
        if (flag === 'CART') {
            if (!current) return Swal.fire({
                title: 'Rất tiếc!',
                text: 'Vui lòng đăng nhập',
                icon: 'info',
                cancelButtonText: 'Quay lại',
                showCancelButton: true,
                confirmButtonText: 'Đăng nhập'
            }).then((rs) => {
                if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
            })
            const response = await apiUpdateCart({ pid: productData._id, color: productData.color })
            if (response.success) {
                toast.success(response.mes)
                dispatch(getCurrent())
            }
            else toast.error(response.mes)
        }
        if (flag === 'WISHLIST') console.log('WISHLIST')
    }

    return (
        <div className='w-full text-base px-2 py-2 '>
            <div
                className='w-full border p-[15px] flex flex-col items-center rounded-3xl shadow-lg bg-white py-6'
                onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
                onMouseEnter={e => setIsShowOption(true)}
                onMouseLeave={e => setIsShowOption(false)}
            >
                <div className='w-full relative'>
                    {isShowOption && <div className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                        {current?.cart?.some(el => el.product === productData._id.toString())
                            ? <span title='Thêm vào giỏ hàng' ><SelectOption icon={<BsCartCheckFill color='green' />} /></span>
                            : <span title='Thêm vào giỏ hàng' onClick={(e) => handleClickOptions(e, 'CART')}><SelectOption icon={<BsFillCartPlusFill color='black' />} /></span>
                        }

                        <span title='Thêm vào yêu thích' onClick={(e) => handleClickOptions(e, 'WISHLIST')}><SelectOption icon={<BsFillSuitHeartFill />} /></span>

                    </div>}

                    <img
                        src={productData?.thumb || 'https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png'}
                        alt=""
                        className='w-[200px] h-[200px] object-cover mx-auto'
                    />
                    {!hideLabel && (
                        <>
                            <img
                                src={label}
                                alt=""
                                className='absolute top-[-30px] left-[-38px] w-[120px] h-[40px] object-cover'
                            />
                            <span className='font-bold text-xl top-[-30px] text-white absolute'>
                                {isNew ? 'New' : 'Hot'}
                            </span>
                        </>
                    )}
                </div>
                <div className='flex flex-col mt-[15px] items-start gap-1 w-full'>
                    <span className='line-clamp-1 font-semibold text-base'>{productData?.title}</span>
                    <span className='font-semibold text-base text-red-500'>{`${formatMoney(productData?.price)}đ`}</span>
                    <span className='flex h-4'>
                        {renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                    </span>

                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(Product)
