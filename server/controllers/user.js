const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')
const qs = require('qs')


const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body;

    if (!email || !password || !lastname || !firstname || !mobile) {
        return res.status(400).json({
            success: false,
            mes: 'Không được để trống',
        });
    }


    const user = await User.findOne({ email });
    if (user) throw new Error('Tài khoản đã tồn tại');

    const token = makeToken();

    const emailedited = btoa(email) + '@' + token
    const newUser = await User.create({
        email: emailedited,
        password,
        firstname,
        lastname,
        mobile
    })

    setTimeout(async () => {
        await User.deleteOne({ email: emailedited })
    }, [300000])


    if (newUser) {
        const html = `<h2>Code đăng ký tài khoản:</h2><br /><blockquote>${token}</blockquote>`;
        await sendMail({
            email,
            html,
            subject: 'Đăng ký tài khoản',
        });
    }

    return res.json({
        success: newUser ? true : false,
        mes: newUser ? 'Vui lòng kiểm tra email' : 'Đã có lỗi xảy ra',
    });
});


const finalRegister = asyncHandler(async (req, res) => {
    const { token } = req.params
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })

    if (notActivedEmail) {
        // Giải mã lại email thật
        notActivedEmail.email = atob(notActivedEmail?.email.split('@')[0])
        await notActivedEmail.save()
    }

    return res.json({
        success: notActivedEmail ? true : false,
        mes: notActivedEmail
            ? 'Đăng ký thành công'
            : 'Đã xảy ra lỗi'
    })
})



const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })

    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, refreshToken, ...userData } = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        const newRefreshToken = generateRefreshToken(response._id)
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Đăng nhập thất bại')
    }

})


const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password').populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price'
        }
    })
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookie')
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body


    if (!email) throw new Error('Hãy nhập email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('Không tìm thấy tài khoản')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu.Link này sẽ hết hạn sau 15 phút kể từ bây giờ.
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`
    const data = {
        email,
        html,
        subject: 'Quên mật khẩu'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Hãy check mail của bạn.' : 'Đã có lỗi, hãy thử lại sau.'
    })
})
const resetPassWord = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Hãy nhập mật khẩu')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Cập nhật mật khẩu thành công' : 'Đã xảy ra lỗi'
    })
})

const getUsers = asyncHandler(async (req, res) => {
    const queries = qs.parse(req.query);

    //Tách các trường đặc biệt ra khỏi query
    const exclufrFiles = ['limit', 'sort', 'page', 'fields']
    exclufrFiles.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    const restQueries = JSON.parse(queryString)
    let formatedQueries = {}


    // Filtering
    if (queries?.name) restQueries.name = { $regex: queries.name, $options: 'i' }
    let queryCommand = User.find(formatedQueries)

    //Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //Field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //Pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)

    queryCommand
        .exec()
        .then(async (response) => {
            const counts = await User.find(formatedQueries).countDocuments()

            return res.status(200).json({
                success: response ? true : false,
                counts,
                users: response ? response : 'Cannot update users'
            })
        })
        .catch((err) => {
            console.error(err.message)
            return res.status(500).json({ success: false, message: err.message })
        })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response ? `User with email ${response.email} delete` : 'No user delete'
    })
})

const updateUser = asyncHandler(async (req, res) => {

    const { _id } = req.user
    const { firstname, lastname, email, mobile, address } = req.body
    const data = { firstname, lastname, email, mobile, address }
    if (req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Cập nhật thành công' : 'Đã xảy ra lỗi'
    })
})




const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response ? response : 'Some thing went wrong'
    })
})


const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response ? response : 'Some thing went wrong'
    })
})

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity = 1, color, price, thumbnail, title } = req.body
    if (!pid || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart.find(el => el.product.toString() == pid && el.color === color)
    if (alreadyProduct) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, {
            $set: {
                "cart.$.quantity": quantity,
                "cart.$.price": price,
                "cart.$.thumbnail": thumbnail,
                "cart.$.title": title,

            }
        }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Thêm vào giỏ hàng thành công' : 'Some thing went wrong'
        })

    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color, price, thumbnail, title } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Thêm vào giỏ hàng thành công' : 'Some thing went wrong'
        })
    }

})

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, color } = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
    if (!alreadyProduct) return res.status(200).json({
        success: true,
        mes: 'Updated your cart'
    })
    const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid, color } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated your cart' : 'Some thing went wrong'
    })
})



module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassWord,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister,
    removeProductInCart
}