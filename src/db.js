// Basic database connection setup using MongoDB and mongoose
const mongoose = require('mongoose');

// Use online MongoDB URI from environment variable
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/eth_service';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

module.exports = mongoose;
