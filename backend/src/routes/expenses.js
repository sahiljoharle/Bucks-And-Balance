const express = require('express');
console.log('Expenses router loaded');
const router = express.Router();

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  testExpenseController
} = require('../controllers/expenseController');


router.get('/controller-test', testExpenseController);
router.post('/', createExpense);
router.get('/', getExpenses); // List all expenses
router.get('/:id', getExpenseById); // Get expense by ID
router.put('/:id', updateExpense); // Update expense
router.delete('/:id', deleteExpense); // Delete expense by ID



module.exports = router;
