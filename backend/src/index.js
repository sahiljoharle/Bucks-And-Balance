const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors()); // to handel Cross Domain Requests 
app.use(express.json()); // to parse JSON bodies

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


