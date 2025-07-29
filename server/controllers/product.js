const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const qs = require('qs')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})

const getProducts = asyncHandler(async (req, res) => {
    // console.log(req.query);
    const queries = qs.parse(req.query);

    //Tách các trường đặc biệt ra khỏi query
    const exclufrFiles = ['limit', 'sort', 'page', 'fields']
    exclufrFiles.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    const formatedQueries = JSON.parse(queryString)
    // console.log(formatedQueries)

    //Filtering 
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    let queryCommand = Product.find(formatedQueries)

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

    queryCommand
        .exec()
        .then(async (response) => {
            const counts = await Product.find(formatedQueries).countDocuments()

            return res.status(200).json({
                success: response ? true : false,
                products: response ? response : 'Cannot update products',
                counts
            })
        })
        .catch((err) => {
            console.error(err.message)
            return res.status(500).json({ success: false, message: err.message })
        })
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        productData: updatedProduct ? updatedProduct : 'Cannot get products'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deleteProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deleteProduct ? true : false,
        productData: deleteProduct ? deleteProduct : 'Cannot delete products'
    })
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
}