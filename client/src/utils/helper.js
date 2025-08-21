import icons from "./icons";

const { AiOutlineStar, AiFillStar } = icons;

export const createslug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-');
export const formatMoney = number => {
    return (Number(number?.toFixed(1)))
        .toLocaleString('vi-VN'); // 'vi-VN' dùng dấu . ngăn cách nghìn
};

export const renderStarFromNumber = (number, size) => {
    if (!Number(number)) return;
    const stars = [];
    for (let i = 0; i < +number; i++) stars.push(<AiFillStar color="orange" size={size || 16} />);
    for (let i = 5; i > +number; i--) stars.push(<AiOutlineStar color="orange" size={size || 16} />);
    return stars;
};

export const validate = (payload, setInvalidFields) => {
    let invalids = 0
    const formatPayload = Object.entries(payload)

    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++
            setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Không được bỏ trống' }])
        }
    }

    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                if (!arr[1].match(regex)) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Sai định dạng email' }])
                }
                break;
            case 'password':
                if (arr[1].length < 6) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Tối thiểu 6 kí tự' }])
                }
                break;
            default:
                break;
        }
    }

    return invalids
}



