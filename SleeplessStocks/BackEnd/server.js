const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
