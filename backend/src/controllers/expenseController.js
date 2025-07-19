const pool = require('../db');

console.log('Expenses Controller loaded');

exports.createExpense = async (req, res) => {
  // Get userId from JWT middleware
  const userId = req.user.userId;
  const { amount, date, category_id, description, source } = req.body;
  try {
    // Insert into the expenses table
    const result = await pool.query(
      `INSERT INTO expenses (user_id, amount, date, category_id, description, source)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, amount, date, category_id, description || null, source || 'manual']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  const userId = req.user.userId;
  try {
    // Get all expenses for the logged-in user, join with categories for nice display
    const result = await pool.query(
      `SELECT expenses.*, categories.name AS category_name
       FROM expenses
       LEFT JOIN categories ON expenses.category_id = categories.id
       WHERE expenses.user_id = $1
       ORDER BY expenses.date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenseById = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT expenses.*, categories.name AS category_name
       FROM expenses
       LEFT JOIN categories ON expenses.category_id = categories.id
       WHERE expenses.id = $1 AND expenses.user_id = $2`,
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { amount, date, category_id, description, source } = req.body;
  try {
    const result = await pool.query(
      `UPDATE expenses
       SET amount = $1,
           date = $2,
           category_id = $3,
           description = $4,
           source = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [amount, date, category_id, description, source, id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted', expense: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpensesByCategory = async (req, res) => {
  const userId = req.user.userId;
  const { category_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT expenses.*, categories.name AS category_name
       FROM expenses
       LEFT JOIN categories ON expenses.category_id = categories.id
       WHERE expenses.user_id = $1 AND expenses.category_id = $2
       ORDER BY expenses.date DESC`,
      [userId, category_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenseSummaryByCategory = async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      `SELECT categories.id, categories.name, SUM(expenses.amount) as total_spent, COUNT(expenses.id) as expense_count
       FROM categories
       LEFT JOIN expenses ON expenses.category_id = categories.id AND expenses.user_id = $1
       WHERE categories.user_id = $1 OR categories.is_default = true
       GROUP BY categories.id, categories.name
       ORDER BY categories.name ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.testExpenseController = (req, res) => {
  res.json({ message: 'Expense controller is connected!' });
};
