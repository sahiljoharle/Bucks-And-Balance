const pool = require('../db');

console.log('Expenses Controller loaded');

exports.createExpense = async (req, res) => {
  // Destructure the request body
  const { user_id, amount, date, category_id, description, source } = req.body;
  try {
    // Insert into the expenses table
    const result = await pool.query(
      `INSERT INTO expenses (user_id, amount, date, category_id, description, source)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, amount, date, category_id, description || null, source || 'manual']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    // Get all expenses, join with categories for nice display
    const result = await pool.query(`
      SELECT expenses.*, categories.name AS category_name
      FROM expenses
      LEFT JOIN categories ON expenses.category_id = categories.id
      ORDER BY expenses.date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenseById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT expenses.*, categories.name AS category_name
       FROM expenses
       LEFT JOIN categories ON expenses.category_id = categories.id
       WHERE expenses.id = $1`,
      [id]
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
       WHERE id = $6
       RETURNING *`,
      [amount, date, category_id, description, source, id]
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
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted', expense: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.testExpenseController = (req, res) => {
  res.json({ message: 'Expense controller is connected!' });
};
