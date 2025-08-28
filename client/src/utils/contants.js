import path from "./path";
import { FaAddressCard } from "react-icons/fa6";
import { BsCartCheckFill } from "react-icons/bs";
import { FaHistory, FaHeart } from "react-icons/fa";

export const navigation = [
    {
        id: 1,
        value: 'TRANG CHỦ',
        path: `/${path.HOME}`
    },
];



export const sorts = [
    { id: 1, value: '-price', text: 'Giá cao đến thấp' },
    { id: 2, value: 'price', text: 'Giá thấp đến cao' },
];

export const voteOptions = [
    {
        id: 1,
        text: 'Rất tệ'
    },
    {
        id: 2,
        text: 'Tệ'
    },
    {
        id: 3,
        text: 'Bình thường'
    },
    {
        id: 4,
        text: 'Tốt'
    },
    {
        id: 5,
        text: 'Tuyệt vời'
    },
];

export const roles = [
    {
        code: 1111,
        value: 'Admin',
    },
    {
        code: 2222,
        value: 'User',
    },
];

export const memberSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Thông tin cá nhân',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <FaAddressCard size={20} />,
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Giỏ hàng của tôi',
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <BsCartCheckFill size={20} />,
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Lịch sử mua hàng',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <FaHistory size={20} />,
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Sản phẩm yêu thích',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <FaHeart size={20} />,
    },
]
export const statusOrders = [
    {
        label: 'Cancalled',
        value: 'Cancalled',
    },
    {
        label: 'Succeed',
        value: 'Succeed',
    }
]
