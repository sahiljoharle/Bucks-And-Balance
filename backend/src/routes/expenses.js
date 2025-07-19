const express = require('express');
console.log('Expenses router loaded');
const router = express.Router();

const imported = require('../controllers/expenseController');
console.log(imported); // Should show all exported functions
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  testExpenseController,
  getExpensesByCategory,
  getExpenseSummaryByCategory
} = imported;

// Most specific routes first
router.get('/controller-test', testExpenseController);
router.get('/summary/by-category', getExpenseSummaryByCategory); // Summary route before :id
router.get('/category/:category_id', getExpensesByCategory);     // Category route before :id

// General CRUD routes
router.post('/', createExpense);
router.get('/', getExpenses); // List all expenses
router.get('/:id', getExpenseById); // Get expense by ID
router.put('/:id', updateExpense); // Update expense
router.delete('/:id', deleteExpense); // Delete expense by ID

module.exports = router;
