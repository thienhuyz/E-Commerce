import avatar from '../assets/avatarDefault.png'
import moment from 'moment'
import 'moment/locale/vi'
import { renderStarFromNumber } from '../utils/helper'

moment.locale('vi')

const Comment = ({ image = avatar, name = 'Anonymous', updatedAt, comment, star }) => {
    return (
        <div className='flex gap-4 mt-4'>
            <div className='flex-none'>
                <img
                    src={image}
                    alt="avatar"
                    className='w-[40px] h-[40px] object-cover rounded-full'
                />
            </div>
            <div className='flex flex-col flex-auto'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-semibold text-xl mt-2'>{name}</h3>
                    <span className='text-base italic'>
                        {moment(updatedAt)?.fromNow()}
                    </span>
                </div>
                <div className='flex flex-col gap-2 pl-8 text-lg mt-2 border border-gray-300 py-2 bg-gray-100 rounded-3xl shadow-md'>
                    <span className='flex items-center gap-1'>
                        <span className='font-semibold'>Đánh giá:</span>
                        <span className='flex items-center gap-1 my-2'>
                            {renderStarFromNumber(star, 24)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </span>
                    </span>
                    <span className='flex gap-1 my-2'>
                        <span className='font-semibold'>Bình luận:</span>
                        <span className='flex items-center gap-1'>{comment}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}


export default Comment
