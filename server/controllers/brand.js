const Brand = require('../models/brand');
const asyncHandler = require('express-async-handler');

const createNewBrand = asyncHandler(async (req, res) => {
    const respone = await Brand.create(req.body);
    return res.json({
        success: respone ? true : false,
        createdBrand: respone ? respone : 'Cannot create new brand',
    })
})

const getBrands = asyncHandler(async (req, res) => {
    const respone = await Brand.find()
    return res.json({
        success: respone ? true : false,
        brands: respone ? respone : 'Cannot get brand',
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const respone = await Brand.findByIdAndUpdate(bid, req.body, { new: true });
    return res.json({
        success: respone ? true : false,
        updatedBrand: respone ? respone : 'Cannot update brand',
    })
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const respone = await Brand.findByIdAndDelete(bid);
    return res.json({
        success: respone ? true : false,
        deletedBrand: respone ? respone : 'Cannot delete brand',
    })
})

module.exports = {
    createNewBrand,
    getBrands,
    updateBrand,
    deleteBrand
}