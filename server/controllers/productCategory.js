const ProductCategory = require('../models/productCategory');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const respone = await ProductCategory.create(req.body);
    return res.json({
        success: respone ? true : false,
        createProductCategory: respone ? respone : 'Cannot create new product-category',
    })
})

const getCategories = asyncHandler(async (req, res) => {
    const respone = await ProductCategory.find().select('title _id')
    return res.json({
        success: respone ? true : false,
        prodCategories: respone ? respone : 'Cannot get product-category',
    })
})

const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const respone = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true });
    return res.json({
        success: respone ? true : false,
        updateCategory: respone ? respone : 'Cannot update product-category',
    })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const respone = await ProductCategory.findByIdAndDelete(pcid);
    return res.json({
        success: respone ? true : false,
        deletedCategory: respone ? respone : 'Cannot delete product-category',
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}