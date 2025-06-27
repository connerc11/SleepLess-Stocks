// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');
const authRoute = require('./routes/auth');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/posts', postsRoute);
app.use('/api/comments', commentsRoute);
app.use('/auth', authRoute);
const profileRoute = require('./routes/profile');
app.use('/profile', profileRoute);

app.get('/', (req, res) => {
  res.send('API Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
