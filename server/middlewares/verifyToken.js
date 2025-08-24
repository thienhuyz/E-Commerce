const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyAccessToken = asyncHandler(async (req, resizeBy, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) return resizeBy.status(401).json({
                success: false,
                mes: 'Invalid access token'
            })
            // console.log(decode)
            req.user = decode
            next()
        })
    } else {
        return resizeBy.status(401).json({
            success: false,
            mes: 'Require authentication'
        })
    }
})

const isAdmin = asyncHandler((req, res, next) => {
    const { role } = req.user
    if (+role !== 1111)
        return res.status(401).json({
            success: false,
            mes: 'Require admin role'
        })
    next()
})

module.exports = {
    verifyAccessToken,
    isAdmin
}