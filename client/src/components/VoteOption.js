import React, { memo, useRef, useEffect, useState } from 'react'
import { voteOptions } from '../utils/contants'
import { AiFillStar } from 'react-icons/ai'
import { Button } from './'

const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
    const modalRef = useRef()
    const [chosenScore, setChosenScore] = useState(null)
    const [comment, setComment] = useState('');
    const [score, setScore] = useState()
    useEffect(() => {
        modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, [])

    return (
        <div onClick={e => e.stopPropagation()} ref={modalRef} className='bg-white rounded-3xl w-[800px] py-4 px-6 flex-col gap-4 flex  justify-center'>

            <h2 className='text-center text-medium font-semibold text-2xl py-4 text-main'>{`Đánh giá và nhận xét sản phẩm ${nameProduct}`}</h2>
            <p className='font-semibold text-lg pl-4 items-start justify-start'>Đánh giá sản phẩm</p>
            <textarea
                className='form-textarea w-full placeholder:italic placeholder:text-base placeholder:text-gray-500 text-base h-[100px] rounded-3xl'
                placeholder='Xin mời chia sẻ mội số cảm nhận về sản phẩm'
                value={comment}
                onChange={e => setComment(e.target.value)}
            ></textarea>
            <div className='w-full flex flex-col gap-4'>
                <p className='font-semibold text-lg pl-4'>Đánh giá sản phẩm</p>
                <div className='flex justify-center gap-4 items-center'>
                    {voteOptions.map(el => (
                        <div
                            className='w-[150px] text-base cursor-pointer rounded-md p-4 h-[100px] flex items-center justify-center flex-col gap-2'
                            key={el.id}
                            onClick={() => {
                                setChosenScore(el.id)
                                setScore(el.id)
                            }}

                        >
                            {(Number(chosenScore) && chosenScore >= el.id)
                                ? <AiFillStar color='orange' size='40' />
                                : <AiFillStar color='gray' size='40' />
                            }
                            <span>{el.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Button handleOnClick={() => handleSubmitVoteOption({ comment, score })} fw>Xác nhận</Button>
        </div>
    )
}

export default memo(VoteOption)
