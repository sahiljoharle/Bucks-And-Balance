const express = require('express');
console.log('Categories router loaded');
const router = express.Router();

const imported = require('../controllers/categoryController');
// console.log(imported); // Should show all exported functions
const { getCategories, createCategory, updateCategory, testCategoryController, deleteCategory } = imported;

// const { testCategoryController, getCategories } = require('../controllers/categoryController');

// Test endpoint
router.get('/test', testCategoryController);

// Main GET endpoint
router.get('/', getCategories);

// Add New 
router.post('/', createCategory);

// Update Existing
router.put('/:id', updateCategory);

// Delete Existing
router.delete('/:id', deleteCategory);

module.exports = router;
