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
    const restQueries = JSON.parse(queryString)
    let formatedQueries = {}
    if (queries?.color) {
        delete restQueries.color
        const colorQuery = queries.color?.split(',').map(el => ({ color: { $regex: el, $options: 'i' } }))
        formatedQueries = { $or: colorQuery }
    }

    // Filtering
    if (queries?.title) restQueries.title = { $regex: queries.title, $options: 'i' }
    if (queries?.category) restQueries.category = { $regex: queries.category, $options: 'i' }
    const q = { ...formatedQueries, ...restQueries }
    let queryCommand = Product.find(q)

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
            const counts = await Product.find(q).countDocuments()

            return res.status(200).json({
                success: response ? true : false,
                counts,
                products: response ? response : 'Cannot update products'
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

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid } = req.body
    if (!star || !pid) throw new Error('Missing inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)

    if (alreadyRating) {
        await Product.updateOne({
            ratings: {
                $elemMatch: {
                    postedBy: _id
                }
            }
        }, {
            $set: {
                'ratings.$.star': star,
                'ratings.$.comment': comment
            }
        }, { new: true })
    } else {
        await Product.findByIdAndUpdate(pid, {
            $push: {
                ratings: {
                    star,
                    comment,
                    postedBy: _id
                }
            }
        }, { new: true })
    }

    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10
    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.files) throw new Error('Missing inputs')
    const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : 'Cannot upload images product'
    })

})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct
}