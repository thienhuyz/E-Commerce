import { useEffect, useState } from 'react'
import SelectQuantity from './SelectQuantity'
import { formatMoney } from '../utils/helper'
import withBaseComponent from '../hocs/withBaseComponent'
import { updateCart } from '../store/user/userSlice'

const OrderItem = ({ dispatch, color, dfQuantity = 1, title, thumbnail, price, pid }) => {
  const [quantity, setQuantity] = useState(() => dfQuantity)

  const handleQuantity = (number) => {
    if (+number > 1) setQuantity(number)
  }

  const handleChangeQuantity = (flag) => {
    if (flag === 'minus' && quantity === 1) return
    if (flag === 'minus') setQuantity(prev => prev - 1)
    if (flag === 'plus') setQuantity(prev => prev + 1)
  }

  useEffect(() => {
    dispatch(updateCart({ pid, quantity, color }))
  }, [quantity])


  return (
    <div className='w-main mx-auto border-b font-bold py-3 grid grid-cols-10'>
      <span className='col-span-4 w-full text-center'>
        <div className='flex gap-2 items-center justify-center'>
          <img src={thumbnail} alt='thumb' className='w-28 h-28 object-cover' />
          <div className='flex flex-col items-start gap-1'>
            <span className='text-lg text-main'>{title}</span>
            <span className='text-base font-main'>{color}</span>
          </div>
        </div>
      </span>

      <span className='col-span-3 w-full text-center'>
        <div className='flex items-center h-full justify-center'>
          <SelectQuantity
            quantity={quantity}
            handleQuantity={handleQuantity}
            handleChangeQuantity={handleChangeQuantity}
          />
        </div>
      </span>

      <span className='col-span-3 w-full h-full flex items-center justify-center text-center'>
        <span className='text-lg'>{formatMoney(price * quantity) + ' VND'}</span>
      </span>
    </div>
  )
}

export default withBaseComponent(OrderItem)
