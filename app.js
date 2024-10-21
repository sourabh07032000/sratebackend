require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware to handle CORS
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
const signupRoutes = require('./routes/signup'); // Adjust the path as needed
const otpRoutes = require('./routes/otp');
const plan = require('./routes/plan');
const plan = require('./routes/investment');

// Use signup and OTP routes
app.use('/signup', signupRoutes);
app.use('/api', otpRoutes);
app.use('/plan', plan);
app.use('/investment', investment);

// Connect to MongoDB using the correct URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Simple route to test if the server is running
app.get('/test', (req, res) => {
  res.status(200).send('Server is running');
});

// Define the port
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
