const BlogCategory = require('../models/blogCategory');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const respone = await BlogCategory.create(req.body);
    return res.json({
        success: respone ? true : false,
        createdCategory: respone ? respone : 'Cannot create new blog-category',
    })
})

const getCategories = asyncHandler(async (req, res) => {
    const respone = await BlogCategory.find().select('title _id')
    return res.json({
        success: respone ? true : false,
        blogCategories: respone ? respone : 'Cannot get blog-category',
    })
})

const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const respone = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true });
    return res.json({
        success: respone ? true : false,
        updateCategory: respone ? respone : 'Cannot update blog-category',
    })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const respone = await BlogCategory.findByIdAndDelete(bcid);
    return res.json({
        success: respone ? true : false,
        deletedCategory: respone ? respone : 'Cannot delete blog-category',
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}