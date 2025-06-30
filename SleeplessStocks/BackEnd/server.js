// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://sleep-less-stocks.vercel.app',
  credentials: true
}));
app.use(express.json());

app.use('/posts', postsRoute);
app.use('/api/comments', commentsRoute);
app.use('/auth', authRoute);
const profileRoute = require('./routes/profile');
app.use('/profile', profileRoute);

app.get('/', (req, res) => {
  res.send('API Running...');
});

const stockRoutes = require('./routes/stock');
app.use('/api/stock', stockRoutes);

const uri = process.env.MONGO_URI || "mongodb+srv://<db_username>:<db_password>@cluster1.p5fevjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function runMongo() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}
runMongo().catch(console.dir);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
