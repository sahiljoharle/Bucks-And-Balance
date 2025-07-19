console.log('Category Controller loaded');
const pool = require('../db');

exports.testCategoryController = (req, res) => {
  res.json({ message: 'Category controller is connected!' });
};

exports.getCategories = async (req, res) => {
    // If using JWT, get user ID from req.user.userId. For now, use a test value:
  const userId = req.user?.userId || 1; // Replace '1' with a real userId if testing without auth

  try {
    const result = await pool.query(
      `SELECT * FROM categories WHERE user_id = $1 OR is_default = true ORDER BY is_default DESC, name ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  // Use user ID from JWT middleware (if using JWT; for now, fallback to static 1)
  const userId = req.user?.userId || 1;
  const { name } = req.body;

  // Validation: Name is required
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    // Insert category (user_id and name; is_default = false for custom)
    const result = await pool.query(
      `INSERT INTO categories (user_id, name, is_default)
       VALUES ($1, $2, false)
       RETURNING *`,
      [userId, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // If name must be unique, check for duplicate error
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const userId = req.user?.userId || 1;
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    // Only allow update if category belongs to user (and is not a default)
    const result = await pool.query(
      `UPDATE categories
       SET name = $1
       WHERE id = $2 AND user_id = $3 AND is_default = false
       RETURNING *`,
      [name, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found or not editable' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const userId = req.user?.userId || 1;
  const { id } = req.params;

  try {
    // 1. Check if category is default or not owned by user
    const catResult = await pool.query(
      `SELECT * FROM categories WHERE id = $1 AND user_id = $2 AND is_default = false`,
      [id, userId]
    );
    if (catResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found or not deletable' });
    }

    // 2. Check if category is used by any expense
    const expenseResult = await pool.query(
      `SELECT 1 FROM expenses WHERE category_id = $1 LIMIT 1`,
      [id]
    );
    if (expenseResult.rows.length > 0) {
      return res.status(400).json({ error: 'Category in use by expenses and cannot be deleted' });
    }

    // 3. Delete category
    await pool.query(
      `DELETE FROM categories WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
