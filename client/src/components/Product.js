import { formatMoney, renderStarFromNumber } from '../utils/helper';
import label from '../assets/label.png';
import { SelectOption } from './'
import icon from '../utils/icons'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import path from '../utils/path'

const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icon

const Product = ({ productData, isNew, hideLabel }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    return (
        <div className='w-full text-base px-2 py-2 '>
            <Link
                className='w-full border p-[15px] flex flex-col items-center rounded-3xl shadow-sm bg-white py-6'
                to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`}
                onMouseEnter={e => setIsShowOption(true)}
                onMouseLeave={e => setIsShowOption(false)}
            >
                <div className='w-full relative'>
                    {isShowOption && <div className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                        <SelectOption icon={<AiFillEye />} />
                        <SelectOption icon={<AiOutlineMenu />} />
                        <SelectOption icon={<BsFillSuitHeartFill />} />
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
                    <span className='font-semibold text-base text-red-500'>{`${formatMoney(productData?.price)} VNĐ`}</span>
                    <span className='flex h-4'>
                        {renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                    </span>

                </div>
            </Link>
        </div>
    );
};

export default Product;
