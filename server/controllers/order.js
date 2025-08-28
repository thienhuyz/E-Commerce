const Order = require('../models/order');
const User = require('../models/user');
const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');
const qs = require('qs')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { products, total, address, status } = req.body
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] })
    }
    const data = { products, total, orderBy: _id }
    if (status) data.status = status
    const rs = await Order.create(data)
    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong',
    })
})


const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.json({
        success: response ? true : false,
        response: response ? response : 'Some thing went wrong'
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    // console.log(req.query);
    const queries = qs.parse(req.query);
    const { _id } = req.user
    //Tách các trường đặc biệt ra khỏi query
    const exclufrFiles = ['limit', 'sort', 'page', 'fields']
    exclufrFiles.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    const formatedQueries = JSON.parse(queryString)
    // let formatedQueries = {}
    // if (queries?.color) {
    //     delete restQueries.color
    //     const colorQuery = queries.color?.split(',').map(el => ({ color: { $regex: el, $options: 'i' } }))
    //     formatedQueries = { $or: colorQuery }
    // }

    // Filtering
    // if (queries?.title) restQueries.title = { $regex: queries.title, $options: 'i' }
    // if (queries?.category) restQueries.category = { $regex: queries.category, $options: 'i' }
    const q = { ...formatedQueries, orderBy: _id }
    let queryCommand = Order.find(q)

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
            const counts = await Order.find(q).countDocuments()

            return res.status(200).json({
                success: response ? true : false,
                counts,
                order: response ? response : 'Cannot update order'
            })
        })
        .catch((err) => {
            console.error(err.message)
            return res.status(500).json({ success: false, message: err.message })
        })
});

const getOrders = asyncHandler(async (req, res) => {
    // console.log(req.query);
    const queries = qs.parse(req.query);

    //Tách các trường đặc biệt ra khỏi query
    const exclufrFiles = ['limit', 'sort', 'page', 'fields']
    exclufrFiles.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    const formatedQueries = JSON.parse(queryString)
    // let formatedQueries = {}
    // if (queries?.color) {
    //     delete restQueries.color
    //     const colorQuery = queries.color?.split(',').map(el => ({ color: { $regex: el, $options: 'i' } }))
    //     formatedQueries = { $or: colorQuery }
    // }

    // Filtering
    // if (queries?.title) restQueries.title = { $regex: queries.title, $options: 'i' }
    // if (queries?.category) restQueries.category = { $regex: queries.category, $options: 'i' }
    const q = { ...formatedQueries }
    let queryCommand = Order.find(q)

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
            const counts = await Order.find(q).countDocuments()

            return res.status(200).json({
                success: response ? true : false,
                counts,
                order: response ? response : 'Cannot update order'
            })
        })
        .catch((err) => {
            console.error(err.message)
            return res.status(500).json({ success: false, message: err.message })
        })
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders
};